import { describe, expect, it } from 'vitest'
import routes from 'router/routes'

describe('legal routes contract', () => {
  it('contains regulations and privacy policy routes', () => {
    const mainRoute = routes.find((route) => route.path === '/')
    const children = mainRoute?.children ?? []

    expect(children.some((route) => route.path === 'regulamin')).toBe(true)
    expect(
      children.some((route) => route.path === 'polityka-prywatnosci'),
    ).toBe(true)
  })
})
