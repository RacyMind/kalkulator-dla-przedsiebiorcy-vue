import { LeasingCalculator } from 'components/leasing/logic/LeasingCalculator'
import { InputFields } from 'components/leasing/interfaces/InputFields'
import { Result } from 'components/leasing/interfaces/Result'
import {
  AssetType,
  EmissionCategory,
  VatDeductionRate,
} from 'components/leasing/types/LeasingTypes'
import { describe, expect, it } from 'vitest'

const defaultInput: InputFields = {
  netAssetValue: 100000,
  initialPaymentRate: 10,
  installmentCount: 36,
  residualValueRate: 1,
  annualInterestRate: 8,
  assetType: AssetType.Car,
  emissionCategory: EmissionCategory.Combustion,
  vatDeductionRate: VatDeductionRate.Half,
  vatRate: 0.23,
}

const getResult = (input: InputFields): Result => {
  return new LeasingCalculator().setInputData(input).calculate().getResult()
}

describe('LeasingCalculator', () => {
  it('The invalid data', () => {
    expect(() => new LeasingCalculator().getResult()).toThrowError('undefined')
    expect(() => new LeasingCalculator().calculate().getResult()).toThrowError(
      'undefined',
    )
  })

  it('Base scenario - car 100k, 10% initial, 36 months, 1% residual, 8% interest', () => {
    const result = getResult(defaultInput)

    expect(result.initialPaymentNet).toBe(10000)
    expect(result.initialPaymentGross).toBe(12300)
    expect(result.financedAmount).toBe(90000)
    expect(result.residualValueNet).toBe(1000)
    expect(result.residualValueGross).toBe(1230)
    expect(result.monthlyInstallmentNet).toBe(2795.6)
    expect(result.monthlyInstallmentGross).toBe(3438.59)
    expect(result.totalInterest).toBe(11641.74)
    expect(result.totalCostNet).toBe(111641.74)
    expect(result.totalCostGross).toBe(137319.34)
    expect(result.totalVat).toBe(25677.6)
    expect(result.deductibleVat).toBe(12838.8)
    expect(result.kupProportion).toBe(1)
    expect(result.totalKup).toBe(123365.54)
    expect(result.schedule).toHaveLength(36)
  })

  it('Car above limit - 200k, combustion (limit 100k)', () => {
    const result = getResult({
      ...defaultInput,
      netAssetValue: 200000,
    })

    expect(result.initialPaymentNet).toBe(20000)
    expect(result.financedAmount).toBe(180000)
    expect(result.residualValueNet).toBe(2000)
    expect(result.kupProportion).toBe(0.5)
    expect(result.monthlyInstallmentNet).toBe(5591.21)
    expect(result.totalInterest).toBe(23283.41)
    expect(result.totalKup).toBe(135007.21)
    expect(result.schedule).toHaveLength(36)
  })

  it('Electric car - 250k, limit 225k', () => {
    const result = getResult({
      ...defaultInput,
      netAssetValue: 250000,
      emissionCategory: EmissionCategory.Electric,
      vatDeductionRate: VatDeductionRate.Half,
    })

    expect(result.initialPaymentNet).toBe(25000)
    expect(result.financedAmount).toBe(225000)
    expect(result.residualValueNet).toBe(2500)
    expect(result.kupProportion).toBe(0.9)
    expect(result.monthlyInstallmentNet).toBe(6989.01)
    expect(result.totalInterest).toBe(29104.31)
    expect(result.deductibleVat).toBe(32097)
    expect(result.totalKup).toBe(280482.86)
    expect(result.schedule).toHaveLength(36)
  })

  it('Other asset type - machine 500k, full VAT deduction', () => {
    const result = getResult({
      ...defaultInput,
      netAssetValue: 500000,
      assetType: AssetType.Other,
      vatDeductionRate: VatDeductionRate.Full,
    })

    expect(result.initialPaymentNet).toBe(50000)
    expect(result.financedAmount).toBe(450000)
    expect(result.residualValueNet).toBe(5000)
    expect(result.kupProportion).toBe(1)
    expect(result.monthlyInstallmentNet).toBe(13978.02)
    expect(result.totalInterest).toBe(58208.54)
    expect(result.deductibleVat).toBe(128387.96)
    expect(result.totalKup).toBe(553208.54)
    expect(result.schedule).toHaveLength(36)
  })

  it('Zero interest rate', () => {
    const result = getResult({
      ...defaultInput,
      annualInterestRate: 0,
    })

    expect(result.initialPaymentNet).toBe(10000)
    expect(result.financedAmount).toBe(90000)
    expect(result.residualValueNet).toBe(1000)
    expect(result.monthlyInstallmentNet).toBe(2472.22)
    expect(result.totalInterest).toBe(0)
    expect(result.totalCostNet).toBe(100000)
    expect(result.schedule).toHaveLength(36)

    const totalCapital = result.schedule.reduce(
      (sum, row) => sum + row.capitalPart,
      0,
    )
    expect(Math.round(totalCapital * 100) / 100).toBe(89000)
  })

  it('Minimum installment count (24)', () => {
    const result = getResult({
      ...defaultInput,
      installmentCount: 24,
    })

    expect(result.monthlyInstallmentNet).toBe(4031.9)
    expect(result.totalInterest).toBe(7765.49)
    expect(result.schedule).toHaveLength(24)
  })

  it('Maximum residual value (50%)', () => {
    const result = getResult({
      ...defaultInput,
      residualValueRate: 50,
    })

    expect(result.residualValueNet).toBe(50000)
    expect(result.financedAmount).toBe(90000)
    expect(result.monthlyInstallmentNet).toBe(1586.79)
    expect(result.schedule).toHaveLength(36)
  })

  it('Schedule sum of capital parts equals financed amount minus residual value', () => {
    const result = getResult(defaultInput)

    const totalCapital = result.schedule.reduce(
      (sum, row) => sum + row.capitalPart,
      0,
    )
    const expected = result.financedAmount - result.residualValueNet

    expect(Math.round(totalCapital * 100) / 100).toBe(expected)
  })

  it('Last installment correction - remaining balance equals residual value', () => {
    const result = getResult(defaultInput)

    const lastRow = result.schedule[result.schedule.length - 1]
    expect(lastRow.remainingBalance).toBe(result.residualValueNet)
  })
})
