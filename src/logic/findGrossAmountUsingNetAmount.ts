import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeCalculator} from 'components/contractOfMandate/logic/EmployeeCalculator'
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {HasGrossAmount} from 'src/logic/interfaces/HasGrossAmount'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export function findGrossAmountUsingNetAmount <InputDataType extends HasGrossAmount>(calculator:Calculator<InputDataType, EmployeeResult>, min:number, max:number, targetAmount:number, input:InputDataType, scale = 100):number {
  for (let iterator = max; iterator >= min; iterator -= scale) {
    input.grossAmount = iterator
    const result = calculator.setInputData(input).calculate().getResult()

    if (Math.abs(result.netAmount - targetAmount) <= 0.0005) {
      return helpers.round(result.grossAmount, 2)
    }

    if (Math.abs(result.netAmount - targetAmount) <= scale) {
      return findGrossAmountUsingNetAmount(calculator, result.netAmount - scale, result.grossAmount + scale, targetAmount, input, scale / 2)
    }
  }

  return 0
}
