import {AnnualEntrepreneurResult, AnnualResult} from 'src/logic/interfaces/AnnualEntrepreneurResult'
import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurCalculator} from 'components/selfEmployment/logic/EntrepreneurCalculator'
import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'
import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export class AnnualEntrepreneurCalculator extends BasicCalculator<InputFields[], AnnualEntrepreneurResult> implements Calculator<InputFields[], AnnualEntrepreneurResult>{

  constructor() {
    super()
  }

  protected getMonthlyResults(yearlyIncome = 0):EntrepreneurResult[] {
    const monthlyResults:EntrepreneurResult[] = []
    const calculator = new EntrepreneurCalculator(true)

    this.getInputData().forEach((monthlyInput, monthIndex) => {
      if(monthIndex > 0) {
        monthlyInput.previousMonthHealthContributionBasis = monthlyResults[monthIndex - 1].healthContributionBasis
        monthlyInput.expenses = helpers.round(monthlyInput.expenses + monthlyResults[monthIndex - 1].deductibleExpenses)
      }
      monthlyInput.yearlyIncome = yearlyIncome
      monthlyResults.push(calculator.setInputData(monthlyInput).calculate().getResult())
    })

    return monthlyResults
  }

  public calculate(): this {
    const sum = (property: keyof EntrepreneurResult) => helpers.sum<EntrepreneurResult>(monthlyResults, property)

    let monthlyResults = this.getMonthlyResults()

    if(this.getInputData()[0].taxSystem === EntrepreneurTaxSystem.LumpSumTax) {
      monthlyResults = this.getMonthlyResults(sum('healthContributionBasis'))
    }

    const annualResult:AnnualResult = {
      revenue: sum('revenue'),
      expenses: sum('expenses'),
      income: sum('income'),
      taxBasis: sum('taxBasis'),
      taxAmount: sum('taxAmount'),
      healthContribution: sum('healthContribution'),
      disabilityContribution: sum('disabilityContribution'),
      pensionContribution: sum('pensionContribution'),
      sickContribution: sum('sickContribution'),
      accidentContribution: sum('accidentContribution'),
      fpContribution: sum('fpContribution'),
      fsContribution: sum('fsContribution'),
    }

    this.result = {
      monthlyResults,
      annualResult,
    }

    return this
  }
}
