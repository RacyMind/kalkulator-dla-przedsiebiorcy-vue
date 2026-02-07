import { InvoiceInputFields } from 'components/invoice/interfaces/InvoiceInputFields'
import { describe, expect, it } from 'vitest'
import {useConstantsStore} from 'stores/constantsStore'
import invoice from 'components/invoice/invoice'

const constants = useConstantsStore()

const defaultInput: InvoiceInputFields = {
  amount: 10000,
  amountType: constants.AMOUNT_TYPES.NET,
  taxRate: 0.23,
}

describe('invoice', () => {
  it('Net amount, 23% VAT', () => {
    const result = invoice.getResult(defaultInput)

    expect(result.grossAmount).toBe(12300)
    expect(result.netAmount).toBe(10000)
    expect(result.taxAmount).toBe(2300)
  })

  it('Net amount, 8% VAT', () => {
    const result = invoice.getResult({ ...defaultInput, taxRate: 0.08 })

    expect(result.taxAmount).toBe(800)
    expect(result.netAmount).toBe(10000)
    expect(result.grossAmount).toBe(10800)
  })

  it('Net amount, 5% VAT', () => {
    const result = invoice.getResult({ ...defaultInput, taxRate: 0.05 })

    expect(result.taxAmount).toBe(500)
    expect(result.netAmount).toBe(10000)
    expect(result.grossAmount).toBe(10500)
  })

  it('Net amount, 0% VAT', () => {
    const result = invoice.getResult({ ...defaultInput, taxRate: 0 })

    expect(result.taxAmount).toBe(0)
    expect(result.netAmount).toBe(10000)
    expect(result.grossAmount).toBe(10000)
  })

  it('Net amount, 0 amount', () => {
    const result = invoice.getResult({ ...defaultInput, amount: 0 })

    expect(result.taxAmount).toBe(0)
    expect(result.netAmount).toBe(0)
    expect(result.grossAmount).toBe(0)
  })

  it('Gross amount, 23% VAT', () => {
    const result = invoice.getResult({
      ...defaultInput,
      amountType: constants.AMOUNT_TYPES.GROSS,
    })

    expect(result.taxAmount).toBe(1869.92)
    expect(result.netAmount).toBe(8130.08)
    expect(result.grossAmount).toBe(10000)
  })

  it('Gross amount, 8% VAT', () => {
    const result = invoice.getResult({
      ...defaultInput,
      amountType: constants.AMOUNT_TYPES.GROSS,
      taxRate: 0.08,
    })

    expect(result.taxAmount).toBe(740.74)
    expect(result.netAmount).toBe(9259.26)
    expect(result.grossAmount).toBe(10000)
  })

  it('Gross amount, 5% VAT', () => {
    const result = invoice.getResult({
      ...defaultInput,
      amountType: constants.AMOUNT_TYPES.GROSS,
      taxRate: 0.05,
    })

    expect(result.taxAmount).toBe(476.19)
    expect(result.netAmount).toBe(9523.81)
    expect(result.grossAmount).toBe(10000)
  })

  it('Gross amount, 0% VAT', () => {
    const result = invoice.getResult({
      ...defaultInput,
      amountType: constants.AMOUNT_TYPES.GROSS,
      taxRate: 0,
    })

    expect(result.taxAmount).toBe(0)
    expect(result.netAmount).toBe(10000)
    expect(result.grossAmount).toBe(10000)
  })

  it('Gross amount, 0 amount', () => {
    const result = invoice.getResult({
      ...defaultInput,
      amountType: constants.AMOUNT_TYPES.GROSS,
      amount: 0,
    })

    expect(result.taxAmount).toBe(0)
    expect(result.netAmount).toBe(0)
    expect(result.grossAmount).toBe(0)
  })
})
