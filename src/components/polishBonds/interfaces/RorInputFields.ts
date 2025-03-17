import {InputFields} from 'components/polishBonds/interfaces/InputFields'

export interface RorInputFields extends InputFields {
  nbpReferenceRates: number[]  // Monthly NBP reference rates
  initialInterestRate: number
}
