import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/salaryForUnusedHolidays/interfaces/InputFields'
import {Result} from 'components/salaryForUnusedHolidays/interfaces/Result'
import {computed} from 'vue'
import {useSettingStore} from 'stores/settingStore'
import helpers from 'src/logic/helpers'

export class SalaryForUnusedHolidaysCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result>{

  constructor() {
    super()
  }

  public calculate(): this {
    const settingStore = useSettingStore()

    const holidayRate = computed(() => settingStore.dateOfLawRules.getFullYear() <= 2023 ? 20.83 : 20.92)

    const proportionalRate =  helpers.round(holidayRate.value * this.getInputData().workingTime, 2)

    let equivalent = helpers.round(this.getInputData().amount / proportionalRate, 2)
    equivalent = helpers.round(equivalent / this.getInputData().dailyNorm, 2)
    equivalent = helpers.round(equivalent * this.getInputData().holidayHours, 2)

    this.result = {
      basicAmount: this.getInputData().amount,
      equivalent,
      holidayRate: holidayRate.value,
      proportionalRate,
    }

    return this
  }
}
