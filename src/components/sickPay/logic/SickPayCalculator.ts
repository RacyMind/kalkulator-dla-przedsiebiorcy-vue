import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/sickPay/interfaces/InputFields'
import {Result} from 'components/sickPay/interfaces/Result'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class SickPayCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result>{

  constructor() {
    super()
  }

  public calculate(): this {
    const {zusConstants} = storeToRefs(useConstantsStore())
    const zusContributionRate = zusConstants.value.employee.rates.pensionContribution + zusConstants.value.employee.rates.disabilityContribution + zusConstants.value.employee.rates.sickContribution

    let amount = helpers.round(this.getInputData().basicAmount * (1 - zusContributionRate), 2)
    amount = helpers.round(amount / 30, 2)
    amount = helpers.round(amount * this.getInputData().rate * this.getInputData().dayCount, 2)

    this.result = {
      basicAmount: this.getInputData().basicAmount,
      dayCount: this.getInputData().dayCount,
      sickPayAmount: amount,
    }

    return this
  }
}
