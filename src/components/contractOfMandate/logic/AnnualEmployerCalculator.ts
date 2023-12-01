import {AnnualEmployerResult} from 'src/logic/interfaces/AnnualEmployerResult'
import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployerCalculator} from 'components/contractOfMandate/logic/EmployerCalculator'
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export class AnnualEmployerCalculator extends BasicCalculator<InputFields[], AnnualEmployerResult> implements Calculator<InputFields[], AnnualEmployerResult>{
  protected readonly employerCalculator:EmployerCalculator

  constructor() {
    super()
    this.employerCalculator = new EmployerCalculator(true)
  }

  public calculate(): this {
    const monthlyResults:EmployerResult[] = []

    this.getInputData().forEach((monthlyInput) => {
      monthlyResults.push(this.employerCalculator.setInputData(monthlyInput).calculate().getResult())
    })

    const sum = (property: keyof EmployerResult) => helpers.sum<EmployerResult>(monthlyResults, property)

    const annualResult:EmployerResult = {
      grossAmount: sum('grossAmount'),
      disabilityContribution: sum('disabilityContribution'),
      pensionContribution: sum('pensionContribution'),
      ppkContribution: sum('ppkContribution'),
      fpContribution: sum('fpContribution'),
      fgspContribution: sum('fgspContribution'),
      fsContribution: sum('fsContribution'),
      accidentContribution: sum('accidentContribution'),
      totalAmount: sum('totalAmount'),
    }

    this.result = {
      monthlyResults,
      annualResult,
    }

    return this
  }
}
