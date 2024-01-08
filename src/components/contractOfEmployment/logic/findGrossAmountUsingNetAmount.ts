import {
  EmployeeCalculator,
} from 'components/contractOfEmployment/logic/EmployeeCalculator'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import {SumUpAmounts} from 'components/contractOfEmployment/interfaces/SumUpAmounts'
import helpers from 'src/logic/helpers'

export function findGrossAmountUsingNetAmount(calculator:EmployeeCalculator, min:number, max:number, targetAmount:number, input:InputFields, sumUpAmounts: SumUpAmounts, scale = 100):number {
  for (let iterator = max; iterator >= min; iterator -= scale) {
    input.grossAmount = iterator
    const result = calculator.setSumUpAmounts(sumUpAmounts).setInputData(input).calculate().getResult()

    if (Math.abs(result.netAmount - targetAmount) <= 0.0005) {
      return helpers.round(result.grossAmount, 2)
    }

    if (Math.abs(result.netAmount - targetAmount) <= scale) {
      return findGrossAmountUsingNetAmount(calculator, result.netAmount - scale, result.grossAmount + scale, targetAmount, input, sumUpAmounts, scale / 2)
    }
  }

  return 0
}
