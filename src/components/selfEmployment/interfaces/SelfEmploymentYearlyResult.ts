import {SelfEmploymentSingleResult} from 'components/selfEmployment/interfaces/SelfEmploymentSingleResult'

export interface SelfEmploymentYearlyResult {
  readonly monthlyResults: SelfEmploymentSingleResult[],
  readonly yearlyResult: SelfEmploymentSingleResult,
}
