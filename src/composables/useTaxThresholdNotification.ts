import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import {EventType, useEventStore} from 'stores/eventStore'

interface MonthlyResult {
  taxBasis: number
}

export function checkTaxThresholdCrossing(monthlyResults: MonthlyResult[] | undefined) {
  const { incomeTaxConstants } = storeToRefs(useConstantsStore())
  const eventStore = useEventStore()

  if (!monthlyResults) return

  let sumUpTaxBasis = 0

  try {
    monthlyResults.forEach((result, monthIndex) => {
      sumUpTaxBasis += result.taxBasis

      if (sumUpTaxBasis >= incomeTaxConstants.value.taxScale.taxThreshold) {
        eventStore.events.push({
          type: EventType.CrossingTaxThreshold,
          sinceMonth: monthIndex,
        })
        throw new Error('Break the loop.')
      }
    })
  } catch {
  }
}
