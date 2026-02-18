import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

vi.mock('components/partials/menu/Menu.vue', () => ({
  default: {
    template: '<div data-test="menu-stub" />',
  },
}))

vi.mock('components/partials/SupportProject.vue', () => ({
  default: {
    template: '<div data-test="support-project-stub" />',
  },
}))

vi.mock('components/partials/PremiumActions.vue', () => ({
  default: {
    template: '<div data-test="premium-actions-stub" />',
  },
}))

vi.mock('components/partials/ScrollToTop.vue', () => ({
  default: {
    template: '<div data-test="scroll-to-top-stub" />',
  },
}))

vi.mock('components/partials/ConsentBanner.vue', () => ({
  default: {
    template: '<div data-test="consent-banner-stub" />',
  },
}))

vi.mock('stores/constantsStore', () => ({
  useConstantsStore: () => ({
    app: {
      name: 'Kalkulator finansowy',
      version: '6.1.1',
    },
  }),
}))

vi.mock('stores/premiumStore', () => ({
  usePremiumStore: () => ({
    isPremiumActive: false,
  }),
}))

vi.mock('stores/breadcrumbStore', () => ({
  useBreadcrumbStore: () => ({
    items: [],
  }),
}))

const { addRecentMock, cycleThemeMock } = vi.hoisted(() => ({
  addRecentMock: vi.fn(),
  cycleThemeMock: vi.fn(),
}))

vi.mock('src/composables/useTheme', () => ({
  useTheme: () => ({
    themeIcon: 'dark_mode',
    themeTooltip: 'Tryb ciemny',
    cycleTheme: cycleThemeMock,
  }),
}))

vi.mock('src/composables/useRecentlyUsed', () => ({
  useRecentlyUsed: () => ({
    addRecent: addRecentMock,
  }),
}))

import MainLayout from 'layouts/MainLayout.vue'

installQuasarPlugin()

const DrawerStub = defineComponent({
  name: 'QDrawer',
  props: {
    modelValue: { type: Boolean, default: false },
    overlay: { type: Boolean, default: false },
    behavior: { type: String, default: 'default' },
  },
  emits: ['update:modelValue'],
  template:
    '<aside data-test="drawer" :data-model-value="String(modelValue)" :data-overlay="String(overlay)" :data-behavior="behavior"><slot /></aside>',
})

const QBtnStub = defineComponent({
  name: 'QBtn',
  emits: ['click'],
  template:
    '<button data-test="q-btn" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
})

const SlotStub = defineComponent({
  template: '<div><slot /></div>',
})

const ScrollAreaStub = defineComponent({
  template:
    '<div data-test="drawer-scroll-area" v-bind="$attrs"><slot /></div>',
})

const routeComponent = defineComponent({
  template: '<div data-test="route-page">page</div>',
})

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: routeComponent },
      { path: '/umowa-o-prace', component: routeComponent },
    ],
  })

const setViewportWidth = async (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true,
  })
  window.dispatchEvent(new Event('resize'))
  await new Promise((resolve) => setTimeout(resolve, 220))
}

const mountLayout = async (path: string) => {
  const router = createTestRouter()
  await router.push(path)
  await router.isReady()

  const wrapper = mount(MainLayout, {
    global: {
      plugins: [router],
      stubs: {
        'q-layout': SlotStub,
        'q-header': SlotStub,
        'q-toolbar': SlotStub,
        'q-toolbar-title': SlotStub,
        'q-drawer': DrawerStub,
        'q-scroll-area': ScrollAreaStub,
        'q-list': SlotStub,
        'q-dialog': SlotStub,
        'q-page-container': SlotStub,
        'q-breadcrumbs': SlotStub,
        'q-breadcrumbs-el': SlotStub,
        'q-icon': SlotStub,
        'q-tooltip': SlotStub,
        'q-btn': QBtnStub,
      },
    },
  })

  await flushPromises()

  return { wrapper, router }
}

const drawerModelValue = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-test="drawer"]').attributes('data-model-value')

const drawerOverlay = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-test="drawer"]').attributes('data-overlay')

const drawerBehavior = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-test="drawer"]').attributes('data-behavior')

describe('MainLayout responsive drawer behavior', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setViewportWidth(1440)
  })

  it('keeps drawer open on desktop for non-dashboard routes', async () => {
    const { wrapper } = await mountLayout('/umowa-o-prace')

    expect(drawerModelValue(wrapper)).toBe('true')
    expect(drawerOverlay(wrapper)).toBe('false')
    expect(drawerBehavior(wrapper)).toBe('desktop')
    expect(wrapper.find('button[aria-label="Menu"]').exists()).toBe(false)
  })

  it('hides drawer on desktop dashboard route', async () => {
    const { wrapper } = await mountLayout('/')

    expect(drawerModelValue(wrapper)).toBe('false')
    expect(drawerOverlay(wrapper)).toBe('false')
    expect(drawerBehavior(wrapper)).toBe('desktop')
    expect(wrapper.find('button[aria-label="Menu"]').exists()).toBe(false)
  })

  it('uses overlay drawer on mobile dashboard and opens by hamburger', async () => {
    await setViewportWidth(420)
    const { wrapper } = await mountLayout('/')

    expect(drawerModelValue(wrapper)).toBe('false')
    expect(drawerOverlay(wrapper)).toBe('true')
    expect(drawerBehavior(wrapper)).toBe('mobile')
    expect(wrapper.find('button[aria-label="Menu"]').exists()).toBe(true)

    await wrapper.get('button[aria-label="Menu"]').trigger('click')
    await flushPromises()

    expect(drawerModelValue(wrapper)).toBe('true')
  })

  it('defines drawer scroll padding contract for AdMob banner offset', () => {
    const layoutSource = readFileSync(
      resolve(process.cwd(), 'src/layouts/MainLayout.vue'),
      'utf8',
    )

    expect(layoutSource).toContain(':style="drawerScrollAreaStyle"')
    expect(layoutSource).toContain(
      'calc(var(--admob-banner-offset, 0px) + env(safe-area-inset-bottom, 0px))',
    )
  })

  it('closes mobile drawer when drawer emits update:modelValue false', async () => {
    await setViewportWidth(420)
    const { wrapper } = await mountLayout('/')

    await wrapper.get('button[aria-label="Menu"]').trigger('click')
    await flushPromises()
    expect(drawerModelValue(wrapper)).toBe('true')

    wrapper.getComponent(DrawerStub).vm.$emit('update:modelValue', false)
    await flushPromises()

    expect(drawerModelValue(wrapper)).toBe('false')
  })

  it('closes mobile drawer after route navigation', async () => {
    await setViewportWidth(420)
    const { wrapper, router } = await mountLayout('/')

    await wrapper.get('button[aria-label="Menu"]').trigger('click')
    await flushPromises()
    expect(drawerModelValue(wrapper)).toBe('true')

    await router.push('/umowa-o-prace')
    await flushPromises()

    expect(drawerModelValue(wrapper)).toBe('false')
  })

  it('clears stale open state when switching from mobile to desktop dashboard', async () => {
    await setViewportWidth(420)
    const { wrapper, router } = await mountLayout('/')

    await wrapper.get('button[aria-label="Menu"]').trigger('click')
    await flushPromises()
    expect(drawerModelValue(wrapper)).toBe('true')

    await setViewportWidth(1440)
    await flushPromises()

    expect(drawerModelValue(wrapper)).toBe('false')
    expect(wrapper.find('button[aria-label="Menu"]').exists()).toBe(false)

    await router.push('/umowa-o-prace')
    await flushPromises()

    expect(drawerModelValue(wrapper)).toBe('true')
  })
})
