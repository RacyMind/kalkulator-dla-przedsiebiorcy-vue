import {InputFields} from 'components/polishBonds/interfaces/InputFields'

export interface DorInputFields extends InputFields {
  nbpReferenceRates: number[]  // Monthly NBP reference rates for 24 months (after the first month)
  initialInterestRate: number  // Initial fixed interest rate for the first month
}
