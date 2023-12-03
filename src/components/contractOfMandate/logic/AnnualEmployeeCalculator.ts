import {AnnualEmployeeResult} from 'src/logic/interfaces/AnnualEmployeeResult'
import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeCalculator} from 'components/contractOfMandate/logic/EmployeeCalculator'
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export class AnnualEmployeeCalculator extends BasicCalculator<InputFields[], AnnualEmployeeResult> implements Calculator<InputFields[], AnnualEmployeeResult>{
  protected readonly employeeCalculator:EmployeeCalculator

  constructor() {
    super()
    this.employeeCalculator = new EmployeeCalculator(true)
  }

  public calculate(): this {
    const monthlyResults:EmployeeResult[] = []

    this.getInputData().forEach((monthlyInput) => {
      monthlyResults.push(this.employeeCalculator.setInputData(monthlyInput).calculate().getResult())
    })

    const sum = (property: keyof EmployeeResult) => helpers.sum<EmployeeResult>(monthlyResults, property)

    const annualResult:EmployeeResult = {
      grossAmount: sum('grossAmount'),
      expenses: sum('expenses'),
      netAmount: sum('netAmount'),
      taxBasis: sum('taxBasis'),
      taxAmount: sum('taxAmount'),
      healthContribution: sum('healthContribution'),
      disabilityContribution: sum('disabilityContribution'),
      pensionContribution: sum('pensionContribution'),
      ppkContribution: sum('ppkContribution'),
      sickContribution: sum('sickContribution'),
      ppkIncomeFromEmployer: sum('ppkIncomeFromEmployer'),
    }

    this.result = {
      monthlyResults,
      annualResult,
    }

    return this
  }
}
