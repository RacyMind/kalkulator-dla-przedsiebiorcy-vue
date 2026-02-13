import { setTimeout as delay } from 'timers/promises'

const DEFAULT_EVENT_TIMEOUT = 15000

export const fetchChromeTargets = async (debugEndpoint) => {
  const response = await fetch(debugEndpoint)
  if (!response.ok) {
    throw new Error(
      `Cannot read Chrome debug endpoint ${debugEndpoint} (HTTP ${response.status})`,
    )
  }

  return response.json()
}

const getHostFromUrl = (url) => {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

export const pickChromeTarget = ({
  targets,
  preferredBaseUrl,
}) => {
  const pageTargets = targets.filter(
    (target) =>
      target.type === 'page' &&
      typeof target.webSocketDebuggerUrl === 'string' &&
      target.webSocketDebuggerUrl,
  )

  if (!pageTargets.length) {
    throw new Error('No debuggable Chrome page targets found')
  }

  const preferredHost = getHostFromUrl(preferredBaseUrl)
  if (preferredHost) {
    const matchedTarget = pageTargets.find((target) => {
      const host = getHostFromUrl(target.url)
      return host === preferredHost
    })

    if (matchedTarget) {
      return matchedTarget
    }
  }

  const firstRegularPage = pageTargets.find(
    (target) =>
      typeof target.url === 'string' &&
      !target.url.startsWith('chrome://') &&
      !target.url.startsWith('chrome-extension://'),
  )

  return firstRegularPage ?? pageTargets[0]
}

class ChromeCdpClient {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl
    this.ws = null
    this.nextId = 1
    this.pendingCommands = new Map()
    this.pendingEvents = new Map()
  }

  async connect() {
    this.ws = new WebSocket(this.webSocketUrl)

    await new Promise((resolve, reject) => {
      const handleOpen = () => {
        this.ws.removeEventListener('error', handleError)
        resolve()
      }

      const handleError = (error) => {
        this.ws.removeEventListener('open', handleOpen)
        reject(new Error(`Cannot connect to Chrome target: ${error.message}`))
      }

      this.ws.addEventListener('open', handleOpen)
      this.ws.addEventListener('error', handleError)
    })

    this.ws.addEventListener('message', (event) => {
      this.handleMessage(event.data)
    })

    this.ws.addEventListener('close', () => {
      this.rejectAllPending(new Error('Chrome target closed the WebSocket'))
    })
  }

  rejectAllPending(error) {
    for (const pending of this.pendingCommands.values()) {
      pending.reject(error)
    }
    this.pendingCommands.clear()

    for (const waiters of this.pendingEvents.values()) {
      waiters.forEach((waiter) => waiter.reject(error))
    }
    this.pendingEvents.clear()
  }

  handleMessage(rawData) {
    const jsonString =
      typeof rawData === 'string' ? rawData : rawData.toString('utf8')
    const payload = JSON.parse(jsonString)

    if (payload.id) {
      const pending = this.pendingCommands.get(payload.id)
      if (!pending) {
        return
      }

      this.pendingCommands.delete(payload.id)

      if (payload.error) {
        pending.reject(
          new Error(
            `CDP ${pending.method} failed: ${payload.error.message || 'unknown error'}`,
          ),
        )
        return
      }

      pending.resolve(payload.result ?? {})
      return
    }

    if (!payload.method) {
      return
    }

    const waiters = this.pendingEvents.get(payload.method)
    if (!waiters || !waiters.length) {
      return
    }

    const nextWaiters = []
    for (const waiter of waiters) {
      if (waiter.predicate(payload.params)) {
        waiter.resolve(payload.params)
      } else {
        nextWaiters.push(waiter)
      }
    }

    if (nextWaiters.length) {
      this.pendingEvents.set(payload.method, nextWaiters)
    } else {
      this.pendingEvents.delete(payload.method)
    }
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId
      this.nextId += 1

      this.pendingCommands.set(id, {
        resolve,
        reject,
        method,
      })

      this.ws.send(
        JSON.stringify({
          id,
          method,
          params,
        }),
      )
    })
  }

  waitForEvent(
    method,
    {
      timeoutMs = DEFAULT_EVENT_TIMEOUT,
      predicate = () => true,
    } = {},
  ) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const waiters = this.pendingEvents.get(method) ?? []
        const remaining = waiters.filter((waiter) => waiter.resolve !== resolve)

        if (remaining.length) {
          this.pendingEvents.set(method, remaining)
        } else {
          this.pendingEvents.delete(method)
        }

        reject(new Error(`Timeout waiting for event ${method}`))
      }, timeoutMs)

      const wrappedResolve = (value) => {
        clearTimeout(timeout)
        resolve(value)
      }

      const wrappedReject = (error) => {
        clearTimeout(timeout)
        reject(error)
      }

      const waiters = this.pendingEvents.get(method) ?? []
      waiters.push({
        resolve: wrappedResolve,
        reject: wrappedReject,
        predicate,
      })
      this.pendingEvents.set(method, waiters)
    })
  }

  async navigate(url, timeoutMs = DEFAULT_EVENT_TIMEOUT) {
    const loadEvent = this.waitForEvent('Page.loadEventFired', { timeoutMs }).catch(
      () => null,
    )

    await this.send('Page.navigate', { url })
    await delay(350)
    await loadEvent
  }

  async reload(timeoutMs = DEFAULT_EVENT_TIMEOUT) {
    const loadEvent = this.waitForEvent('Page.loadEventFired', { timeoutMs }).catch(
      () => null,
    )
    await this.send('Page.reload', { ignoreCache: true })
    await delay(450)
    await loadEvent
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })

    if (result.exceptionDetails) {
      const message = result.exceptionDetails.text ?? 'Runtime.evaluate failed'
      throw new Error(message)
    }

    return result.result?.value
  }

  async captureScreenshot() {
    const result = await this.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    })

    return result.data
  }

  async close() {
    if (!this.ws) {
      return
    }

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close()
      await delay(100)
    }

    this.ws = null
  }
}

export const createChromeCdpClient = async ({
  debugEndpoint,
  preferredBaseUrl,
}) => {
  const targets = await fetchChromeTargets(debugEndpoint)
  const target = pickChromeTarget({ targets, preferredBaseUrl })
  const client = new ChromeCdpClient(target.webSocketDebuggerUrl)

  await client.connect()
  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Network.enable')
  await client.send('Emulation.clearDeviceMetricsOverride')

  return {
    client,
    target,
  }
}
