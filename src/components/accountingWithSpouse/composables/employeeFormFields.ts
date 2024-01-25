import {EmployeeFormFields} from 'components/accountingWithSpouse/interfaces/FormFields'
import {Ref, watch} from 'vue'

export const watchEmployeeFormFields = (fields:Ref<EmployeeFormFields>) => {

  watch(() => fields.value.hasAmountForEachMonth, (hasAmountForEachMonth) => {
    if (!hasAmountForEachMonth) {
      fields.value.grossAmounts = []
      return
    }
    if(fields.value.grossAmounts.length) {
      return
    }

    for(let i = 0; i < 12; i++) {
      fields.value.grossAmounts[i] = fields.value.grossAmount ?? 0
    }
  })
}
