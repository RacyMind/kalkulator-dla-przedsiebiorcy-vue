import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {describe, expect, it} from '@jest/globals'
import {installQuasarPlugin} from '@quasar/quasar-app-extension-testing-unit-jest'
import interest from 'components/interest/interest'

installQuasarPlugin()

const defaultInput:InterestInputFields = {
  amount:10000,
  dayCount:15,
  rate:0.1,
}

describe('interest',()=>{


  it('0 , 15 days, rate 10%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,amount:0})
    expect(dayCount).toBe(15)
    expect(amount).toBe(0)
    expect(interestAmount).toBe(0)
  })

  it('10000 , 0 days, rate 10%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,dayCount:0})
    expect(dayCount).toBe(0)
    expect(amount).toBe(10000)
    expect(interestAmount).toBe(0)
  })

  it('10000 , 15 days, rate 0',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,rate:0})
    expect(dayCount).toBe(15)
    expect(amount).toBe(10000)
    expect(interestAmount).toBe(0)
  })

  it('10000 , 15 days, rate 10%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult(defaultInput)
    expect(dayCount).toBe(15)
    expect(amount).toBe(10000)
    expect(interestAmount).toBe(41.10)
  })

  it('10000 , 15 days, rate 5%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,rate:0.05})
    expect(dayCount).toBe(15)
    expect(amount).toBe(10000)
    expect(interestAmount).toBe(20.55)
  })

  it('10000 , 65 days, rate 50%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,rate:0.5,dayCount:65})
    expect(dayCount).toBe(65)
    expect(amount).toBe(10000)
    expect(interestAmount).toBe(890.41)
  })

  it('5000 , 15 days, rate 5%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,amount:5000,rate:0.05})
    expect(dayCount).toBe(15)
    expect(amount).toBe(5000)
    expect(interestAmount).toBe(10.27)
  })

  it('5000 , 2 days, rate 5%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({dayCount:2,amount:5000,rate:0.05})
    expect(dayCount).toBe(2)
    expect(amount).toBe(5000)
    expect(interestAmount).toBe(1.37)
  })

  it('5000.50 , 15 days, rate 10%',()=>{
    const {dayCount,amount,interestAmount} = interest.getResult({...defaultInput,dayCount:15,amount:5000.50})
    expect(dayCount).toBe(15)
    expect(amount).toBe(5000.50)
    expect(interestAmount).toBe(20.55)
  })

})
