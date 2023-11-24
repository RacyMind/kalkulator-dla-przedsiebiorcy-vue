import {AnnualEmployeeResult} from 'components/contractOfMandate/interfaces/AnnualEmployeeResult'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeCalculator} from 'components/contractOfMandate/logic/EmployeeCalculator'
import {EmployeeResult} from 'components/contractOfMandate/interfaces/EmployeeResult'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'

export class AnnualEmployeeCalculator implements Calculator<InputFields[], AnnualEmployeeResult>{
  protected readonly employeeCalculator:EmployeeCalculator
  protected inputData: InputFields[] | undefined
  protected result: AnnualEmployeeResult | undefined

  constructor() {
   this.employeeCalculator = new EmployeeCalculator(true)
  }

  protected getInputData():InputFields[] {
    if( this.inputData === undefined) {
      throw Error('The input data is undefined!')
    }
    return this.inputData
  }

  setInputData(input: InputFields[]): this {
    this.inputData = input
    return this
  }

  getResult(): AnnualEmployeeResult {
    if( this.result === undefined) {
      throw Error('The result is undefined!')
    }
    return this.result
  }

  calculate(): this {
    const monthlyResults:EmployeeResult[] = []

    this.getInputData().forEach((monthlyInput) => {
      monthlyResults.push(this.employeeCalculator.setInputData(monthlyInput).calculate().getResult())
    })

    const sum = (property: keyof EmployeeResult) => monthlyResults.reduce((accumulator:number, object:EmployeeResult) => {
      return accumulator + object[property]
    }, 0)

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
    }

    this.result = {
      monthlyResults,
      annualResult,
    }

    return this
  }
}
