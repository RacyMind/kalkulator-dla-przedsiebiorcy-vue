import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/rentalProfit/interfaces/InputFields'
import {Result, Summary, YearResult} from 'components/rentalProfit/interfaces/Result'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class RentalProfitCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result> {

  private calculateTax(taxableRevenue: number, isSpouseSettlement: boolean): number {
    const constants = useConstantsStore()
    const threshold = isSpouseSettlement
      ? constants.rentalTax.spouseThreshold
      : constants.rentalTax.threshold

    if (taxableRevenue <= 0) return 0

    if (taxableRevenue <= threshold) {
      return helpers.round(taxableRevenue * constants.rentalTax.lumpSumRate, 2)
    }

    return helpers.round(
      threshold * constants.rentalTax.lumpSumRate
      + (taxableRevenue - threshold) * constants.rentalTax.lumpSumRateAboveThreshold,
      2,
    )
  }

  public calculate(): this {
    const input = this.getInputData()
    const activeMonths = 12 - input.vacancyMonths
    const yearResults: YearResult[] = []
    let cumulativeProfit = 0

    for (let year = 1; year <= input.numberOfYears; year++) {
      const monthlyRent = helpers.round(
        input.monthlyRent * Math.pow(1 + input.annualRentIncrease / 100, year - 1),
        2,
      )

      const grossRevenue = helpers.round(monthlyRent * activeMonths, 2)
      const taxableRevenue = helpers.round(grossRevenue - (input.refactoredCharges * activeMonths), 2)
      const tax = this.calculateTax(taxableRevenue, input.isSpouseSettlement)
      const annualExpenses = helpers.round(input.monthlyExpenses * 12, 2)
      const netProfit = helpers.round(grossRevenue - tax - annualExpenses, 2)
      cumulativeProfit = helpers.round(cumulativeProfit + netProfit, 2)

      const effectiveTaxRate = grossRevenue > 0
        ? helpers.round(tax / grossRevenue * 100, 2)
        : 0

      yearResults.push({
        year,
        monthlyRent,
        grossRevenue,
        taxableRevenue,
        tax,
        annualExpenses,
        netProfit,
        effectiveTaxRate,
        cumulativeProfit,
      })
    }

    const totalMonths = input.numberOfYears * 12
    const totalGrossRevenue = helpers.round(yearResults.reduce((sum, yr) => sum + yr.grossRevenue, 0), 2)
    const totalTaxableRevenue = helpers.round(yearResults.reduce((sum, yr) => sum + yr.taxableRevenue, 0), 2)
    const totalTax = helpers.round(yearResults.reduce((sum, yr) => sum + yr.tax, 0), 2)
    const totalExpenses = helpers.round(yearResults.reduce((sum, yr) => sum + yr.annualExpenses, 0), 2)
    const totalNetProfit = helpers.round(yearResults.reduce((sum, yr) => sum + yr.netProfit, 0), 2)

    const summary: Summary = {
      totalGrossRevenue,
      totalTaxableRevenue,
      totalTax,
      totalExpenses,
      totalNetProfit,
      averageMonthlyProfit: helpers.round(totalNetProfit / totalMonths, 2),
      effectiveTaxRate: totalGrossRevenue > 0
        ? helpers.round(totalTax / totalGrossRevenue * 100, 2)
        : 0,
    }

    this.result = {
      yearResults,
      summary,
    }

    return this
  }
}
