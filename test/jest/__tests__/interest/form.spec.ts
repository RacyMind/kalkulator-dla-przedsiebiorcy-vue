import {describe, expect,it} from '@jest/globals'
import {installQuasarPlugin} from '@quasar/quasar-app-extension-testing-unit-jest'
import {mount} from '@vue/test-utils'
import Form from 'components/interest/Form.vue'
import constants from 'src/logic/constants'

installQuasarPlugin()
describe('Interest form',()=>{

  it('basic capital rate  toggle should set rate to 10.25',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="basic-capital-rate"]').trigger('click')
    const input = wrapper.find('[data-testid="rate"]').element as HTMLInputElement
    expect(Number(input.value)).toBe(constants.BASIC_CAPITAL_INTEREST_RATE)
  })

  it('basic late rate  toggle should set rate to 12.25',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="basic-late-rate"]').trigger('click')
    const input = wrapper.find('[data-testid="rate"]').element as HTMLInputElement
    expect(Number(input.value)).toBe(constants.BASIC_LATE_INTEREST_RATE)
  })

  it('button is disabled if no input',async ()=>{
    const wrapper = mount(Form)
    const button = await wrapper.find('[data-testid="button"]').element as  HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('button is disabled if amount is missing',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="rate"]').setValue(10)
    await wrapper.find('[data-testid="startDate"]').setValue('14.10.2023')
    await wrapper.find('[data-testid="endDate"]').setValue('16.10.2023')
    const button = await wrapper.find('[data-testid="button"]').element as  HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('button is disabled if rate is missing',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="amount"]').setValue(10)
    await wrapper.find('[data-testid="rate"]').setValue(0)
    await wrapper.find('[data-testid="startDate"]').setValue('14.10.2023')
    await wrapper.find('[data-testid="endDate"]').setValue('16.10.2023')
    const button = await wrapper.find('[data-testid="button"]').element as  HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('button is disabled if start date is after end date',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="amount"]').setValue(10)
    await wrapper.find('[data-testid="rate"]').setValue(0)
    await wrapper.find('[data-testid="startDate"]').setValue('16.10.2023')
    await wrapper.find('[data-testid="endDate"]').setValue('15.10.2023')
    const button = await wrapper.find('[data-testid="button"]').element as  HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('button should be clickable if form is filled correctly',async ()=>{
    const wrapper = mount(Form)
    await wrapper.find('[data-testid="amount"]').setValue(10)
    await wrapper.find('[data-testid="rate"]').setValue(2)
    await wrapper.find('[data-testid="startDate"]').setValue('15.10.2023')
    await wrapper.find('[data-testid="endDate"]').setValue('16.10.2023')
    const button = await wrapper.find('[data-testid="button"]').element as  HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

})

