import {InputFields} from 'components/rentalProfit/interfaces/InputFields'
import {RentalProfitCalculator} from 'components/rentalProfit/logic/RentalProfitCalculator'
import {Result} from 'components/rentalProfit/interfaces/Result'
import {createPinia, setActivePinia} from 'pinia'
import {describe, expect, it} from 'vitest'

setActivePinia(createPinia())

const defaultInput: InputFields = {
  monthlyRent: 3000,
  monthlyExpenses: 800,
  refactoredCharges: 500,
  numberOfYears: 1,
  isSpouseSettlement: false,
  vacancyMonths: 0,
  annualRentIncrease: 0,
}

const getResult = (input: InputFields): Result => {
  return new RentalProfitCalculator().setInputData(input).calculate().getResult()
}

describe('RentalProfitCalculator - US1: Annual calculation', () => {
  it('The invalid data', () => {
    expect(() => new RentalProfitCalculator().getResult()).toThrowError('undefined')
    expect(() => new RentalProfitCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('Basic annual calculation (Scenario 1)', () => {
    const result = getResult(defaultInput)
    const year1 = result.yearResults[0]

    expect(year1.year).toBe(1)
    expect(year1.monthlyRent).toBe(3000)
    expect(year1.grossRevenue).toBe(36000)
    expect(year1.taxableRevenue).toBe(30000)
    expect(year1.tax).toBe(2550)
    expect(year1.annualExpenses).toBe(9600)
    expect(year1.netProfit).toBe(23850)
    expect(year1.effectiveTaxRate).toBe(7.08)
    expect(year1.cumulativeProfit).toBe(23850)

    expect(result.summary.totalGrossRevenue).toBe(36000)
    expect(result.summary.totalTax).toBe(2550)
    expect(result.summary.totalExpenses).toBe(9600)
    expect(result.summary.totalNetProfit).toBe(23850)
    expect(result.summary.averageMonthlyProfit).toBe(1987.5)
    expect(result.summary.effectiveTaxRate).toBe(7.08)
  })

  it('Threshold crossing - revenue above 100k (Scenario 3)', () => {
    const result = getResult({
      ...defaultInput,
      monthlyRent: 15000,
      refactoredCharges: 2000,
      monthlyExpenses: 3000,
    })
    const year1 = result.yearResults[0]

    expect(year1.grossRevenue).toBe(180000)
    expect(year1.taxableRevenue).toBe(156000)
    expect(year1.tax).toBe(15500)
    expect(year1.annualExpenses).toBe(36000)
    expect(year1.netProfit).toBe(128500)
    expect(year1.effectiveTaxRate).toBe(8.61)
  })

  it('Revenue exactly at threshold (100k)', () => {
    const result = getResult({
      ...defaultInput,
      monthlyRent: 10000,
      refactoredCharges: 1666.67,
      monthlyExpenses: 0,
    })
    const year1 = result.yearResults[0]

    expect(year1.grossRevenue).toBe(120000)
    expect(year1.taxableRevenue).toBe(99999.96)
    expect(year1.tax).toBe(8500)
    expect(year1.effectiveTaxRate).toBe(7.08)
  })

  it('Zero revenue - only expenses', () => {
    const result = getResult({
      ...defaultInput,
      monthlyRent: 0,
      refactoredCharges: 0,
      monthlyExpenses: 800,
    })
    const year1 = result.yearResults[0]

    expect(year1.grossRevenue).toBe(0)
    expect(year1.taxableRevenue).toBe(0)
    expect(year1.tax).toBe(0)
    expect(year1.annualExpenses).toBe(9600)
    expect(year1.netProfit).toBe(-9600)
    expect(year1.effectiveTaxRate).toBe(0)
  })
})

describe('RentalProfitCalculator - US2: Multi-year projection', () => {
  it('3-year projection without indexation', () => {
    const result = getResult({
      ...defaultInput,
      numberOfYears: 3,
    })

    expect(result.yearResults).toHaveLength(3)

    expect(result.yearResults[0].netProfit).toBe(23850)
    expect(result.yearResults[0].cumulativeProfit).toBe(23850)

    expect(result.yearResults[1].netProfit).toBe(23850)
    expect(result.yearResults[1].cumulativeProfit).toBe(47700)

    expect(result.yearResults[2].netProfit).toBe(23850)
    expect(result.yearResults[2].cumulativeProfit).toBe(71550)

    expect(result.summary.totalNetProfit).toBe(71550)
    expect(result.summary.totalTax).toBe(7650)
    expect(result.summary.totalExpenses).toBe(28800)
    expect(result.summary.averageMonthlyProfit).toBe(1987.5)
  })

  it('3-year projection with 5% annual rent increase', () => {
    const result = getResult({
      ...defaultInput,
      numberOfYears: 3,
      annualRentIncrease: 5,
    })

    expect(result.yearResults).toHaveLength(3)

    // Year 1: monthlyRent = 3000
    expect(result.yearResults[0].monthlyRent).toBe(3000)
    expect(result.yearResults[0].grossRevenue).toBe(36000)
    expect(result.yearResults[0].taxableRevenue).toBe(30000)
    expect(result.yearResults[0].tax).toBe(2550)

    // Year 2: monthlyRent = 3000 * 1.05 = 3150
    expect(result.yearResults[1].monthlyRent).toBe(3150)
    expect(result.yearResults[1].grossRevenue).toBe(37800)
    expect(result.yearResults[1].taxableRevenue).toBe(31800)
    expect(result.yearResults[1].tax).toBe(2703)

    // Year 3: monthlyRent = 3000 * 1.05^2 = 3307.50
    expect(result.yearResults[2].monthlyRent).toBe(3307.5)
    expect(result.yearResults[2].grossRevenue).toBe(39690)
    expect(result.yearResults[2].taxableRevenue).toBe(33690)
    expect(result.yearResults[2].tax).toBe(2863.65)
  })
})

describe('RentalProfitCalculator - US3: Spouse settlement', () => {
  it('Spouse settlement ON - 150k below 200k threshold', () => {
    const result = getResult({
      ...defaultInput,
      monthlyRent: 12500,
      refactoredCharges: 0,
      monthlyExpenses: 0,
      isSpouseSettlement: true,
    })
    const year1 = result.yearResults[0]

    expect(year1.taxableRevenue).toBe(150000)
    expect(year1.tax).toBe(12750)
  })

  it('Spouse settlement OFF - 150k exceeds 100k threshold', () => {
    const result = getResult({
      ...defaultInput,
      monthlyRent: 12500,
      refactoredCharges: 0,
      monthlyExpenses: 0,
      isSpouseSettlement: false,
    })
    const year1 = result.yearResults[0]

    expect(year1.taxableRevenue).toBe(150000)
    expect(year1.tax).toBe(14750)
  })
})

describe('RentalProfitCalculator - US4: Vacancy months', () => {
  it('1 vacancy month - revenue for 11 months, expenses for 12', () => {
    const result = getResult({
      ...defaultInput,
      vacancyMonths: 1,
    })
    const year1 = result.yearResults[0]

    expect(year1.grossRevenue).toBe(33000)
    expect(year1.taxableRevenue).toBe(27500)
    expect(year1.annualExpenses).toBe(9600)
    expect(year1.tax).toBe(2337.5)
    expect(year1.netProfit).toBe(21062.5)
  })

  it('12 vacancy months - zero revenue, only expenses', () => {
    const result = getResult({
      ...defaultInput,
      vacancyMonths: 12,
    })
    const year1 = result.yearResults[0]

    expect(year1.grossRevenue).toBe(0)
    expect(year1.taxableRevenue).toBe(0)
    expect(year1.tax).toBe(0)
    expect(year1.annualExpenses).toBe(9600)
    expect(year1.netProfit).toBe(-9600)
  })
})
