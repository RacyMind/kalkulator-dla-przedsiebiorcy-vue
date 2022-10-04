import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {ContractWorkResult} from 'components/contractWork/interfaces/ContractWorkResult'
import { describe, expect, it } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import constants from '../../../../src/logic/constants'
import contractWork from 'components/contractWork/contractWork'
import helpers from '../../../../src/logic/helpers'

installQuasarPlugin()

const defaultInput:ContractWorkInputFields = {
  amount: 1000,
  amountType: 'gross',
  expenseRate: 0.2,
  year: helpers.getDefaultYear(),
}

const getResult = (input:ContractWorkInputFields):ContractWorkResult => {
  contractWork.setParams(input.year)
  return contractWork.getResult(input)
}

describe('contractWork', () => {
  it('Gross amount, 20% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(200)
    expect(result.basisForTax).toBe(800)
    expect(result.taxAmount).toBe(96)
    expect(result.netAmount).toBe(904)
  })

  it('Gross amount, 50% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
      expenseRate: 0.5,
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(500)
    expect(result.basisForTax).toBe(500)
    expect(result.taxAmount).toBe(60)
    expect(result.netAmount).toBe(940)
  })

  it('Net amount, 20% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
      amount: 904,
      amountType: 'net',
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(200)
    expect(result.basisForTax).toBe(800)
    expect(result.taxAmount).toBe(96)
    expect(result.netAmount).toBe(904)
  })

  it('Net amount, 50% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
      amount: 940,
      amountType: 'net',
      expenseRate: 0.5,
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(500)
    expect(result.basisForTax).toBe(500)
    expect(result.taxAmount).toBe(60)
    expect(result.netAmount).toBe(940)
  })

  it('Gross amount - 200, 20% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
      amount: 200,
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(200)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(200)
    expect(result.taxAmount).toBe(24)
    expect(result.netAmount).toBe(176)
  })

  it('Net amount - 176, 20% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
      amount: 176,
      amountType: 'net',
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(200)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(200)
    expect(result.taxAmount).toBe(24)
    expect(result.netAmount).toBe(176)
  })

  it('Gross amount - 300 000, 50% expenses', () => {
    const input:ContractWorkInputFields = {
      ...defaultInput,
      amount: 300000,
      expenseRate: 0.5,
    }

    const result = getResult(input)

    expect(result.grossAmount).toBe(300000)
    expect(result.expenses).toBe(120000)
    expect(result.basisForTax).toBe(180000)
    expect(result.taxAmount).toBe(21600)
    expect(result.netAmount).toBe(278400)
  })
})
