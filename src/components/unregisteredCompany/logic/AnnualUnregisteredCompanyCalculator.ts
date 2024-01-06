import {AnnualResult} from 'components/unregisteredCompany/interfaces/AnnualResult'
import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {Result} from 'components/unregisteredCompany/interfaces/Result'
import {UnregisteredCompanyCalculator} from 'components/unregisteredCompany/logic/UnregisteredCompanyCalculator'
import helpers from 'src/logic/helpers'

export class AnnualUnregisteredCompanyCalculator extends BasicCalculator<InputFields[], AnnualResult> implements Calculator<InputFields[], AnnualResult>{
  protected readonly calculator:UnregisteredCompanyCalculator

  constructor() {
    super()
    this.calculator = new UnregisteredCompanyCalculator(true)
  }

  public calculate(): this {
    const monthlyResults:Result[] = []

    this.getInputData().forEach((monthlyInput) => {
      monthlyResults.push(this.calculator.setInputData(monthlyInput).calculate().getResult())
    })

    const sum = (property: keyof Result) => helpers.sum<Result>(monthlyResults, property)

    const annualResult:Result = {
      revenue: sum('revenue'),
      expenses: sum('expenses'),
      income: sum('income'),
      taxBasis: sum('taxBasis'),
      taxAmount: sum('taxAmount'),
    }

    this.result = {
      monthlyResults,
      annualResult,
    }

    return this
  }
}
