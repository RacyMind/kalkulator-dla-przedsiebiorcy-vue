import {describe, expect,it} from '@jest/globals'
import {installQuasarPlugin} from '@quasar/quasar-app-extension-testing-unit-jest'
import {mount} from '@vue/test-utils'
import Form from 'components/interest/Form.vue'

installQuasarPlugin()


describe('Interest form',()=>{

  it('basic capital rate  toggle should set rate to 10.25',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="basic-capital-rate"]').trigger('click')
    const input = wrapper.find('[data-testid="rate"]').element as HTMLInputElement
    expect(input.value).toBe('10.25')
  })

  it('basic late rate  toggle should set rate to 12.25',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="basic-late-rate"]').trigger('click')
    const input = wrapper.find('[data-testid="rate"]').element as HTMLInputElement
    expect(input.value).toBe('12.25')
  })

})

