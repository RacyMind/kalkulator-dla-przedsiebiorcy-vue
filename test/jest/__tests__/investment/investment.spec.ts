import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {describe, expect, it} from '@jest/globals'
import investment from 'components/investment/investment'

const defaultInput:InvestmentInputFields = {
  amount:10000,
  monthCount:12,
  rate:0.1,
}

describe('investment',()=>{
  it('12 months, 10%, 10000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult(defaultInput)
    expect(capital).toBe(10000)
    expect(grossAmount).toBe(1000)
    expect(netAmount).toBe(810)
    expect(taxAmount).toBe(190)
  })

  it('6 months, 10%, 10000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({...defaultInput,monthCount:6})
    expect(capital).toBe(10000)
    expect(grossAmount).toBe(500)
    expect(netAmount).toBe(405)
    expect(taxAmount).toBe(95)
  })

  it('3 months, 10%, 10000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({...defaultInput,monthCount:3})
    expect(capital).toBe(10000)
    expect(grossAmount).toBe(250)
    expect(netAmount).toBe(202.50)
    expect(taxAmount).toBe(47.5)
  })

  it('1 month, 10%, 10000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({...defaultInput,monthCount:1})
    expect(capital).toBe(10000)
    expect(grossAmount).toBe(83.33)
    expect(netAmount).toBe(67.50)
    expect(taxAmount).toBe(15.83)
  })

  it('12 months, 5%, 5000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({...defaultInput,amount:5000,rate:0.05})
    expect(capital).toBe(5000)
    expect(grossAmount).toBe(250)
    expect(netAmount).toBe(202.50)
    expect(taxAmount).toBe(47.50)
  })

  it('6 months, 5%, 5000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({monthCount:6,amount:5000,rate:0.05})
    expect(capital).toBe(5000)
    expect(grossAmount).toBe(125)
    expect(netAmount).toBe(101.25)
    expect(taxAmount).toBe(23.75)
  })

  it('3 months, 5%, 5000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({monthCount:3,amount:5000,rate:0.05})
    expect(capital).toBe(5000)
    expect(grossAmount).toBe(62.5)
    expect(netAmount).toBe(50.62)
    expect(taxAmount).toBe(11.88)
  })

  it('1 month, 5%, 5000',()=>{
    const {capital,grossAmount,netAmount,taxAmount} = investment.getResult({monthCount:1,amount:5000,rate:0.05})
    expect(capital).toBe(5000)
    expect(grossAmount).toBe(20.83)
    expect(netAmount).toBe(16.87)
    expect(taxAmount).toBe(3.96)
  })

})

