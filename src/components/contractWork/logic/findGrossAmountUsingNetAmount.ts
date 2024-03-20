import {ContractWorkCalculator} from 'components/contractWork/logic/ContractWorkCalculator'
import {InputFields} from 'components/contractWork/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export function findGrossAmountUsingNetAmount(calculator:ContractWorkCalculator, min:number, max:number, targetAmount:number, input:InputFields, scale = 100):number {
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
