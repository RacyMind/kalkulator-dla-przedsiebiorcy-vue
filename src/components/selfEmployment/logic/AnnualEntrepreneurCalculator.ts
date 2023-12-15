import {AnnualEntrepreneurResult, AnnualResult} from 'src/logic/interfaces/AnnualEntrepreneurResult'
import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurCalculator} from 'components/selfEmployment/logic/EntrepreneurCalculator'
import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export class AnnualEntrepreneurCalculator extends BasicCalculator<InputFields[], AnnualEntrepreneurResult> implements Calculator<InputFields[], AnnualEntrepreneurResult>{
  protected readonly calculator:EntrepreneurCalculator

  constructor() {
    super()
    this.calculator = new EntrepreneurCalculator(true)
  }

  public calculate(): this {
    const monthlyResults:EntrepreneurResult[] = []

    this.getInputData().forEach((monthlyInput, monthIndex) => {
      if(monthIndex > 0) {
        monthlyInput.previousMonthHealthContributionBasis = monthlyResults[monthIndex - 1].healthContributionBasis
        monthlyInput.expenses = helpers.round(monthlyInput.expenses + monthlyResults[monthIndex - 1].deductibleExpenses)
      }
      monthlyResults.push(this.calculator.setInputData(monthlyInput).calculate().getResult())
    })

    const sum = (property: keyof EntrepreneurResult) => helpers.sum<EntrepreneurResult>(monthlyResults, property)

    const annualResult:AnnualResult = {
      revenue: sum('revenue'),
      netAmount: sum('netAmount'),
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
