import {AvailableYear} from 'src/types/AvailableYear'

export interface InputFields {
  grossAmount: number,
  workInLivePlace: boolean,
  hasTaxRelief: boolean,
  partTaxReducingAmount: number,
  partOfWorkWithAuthorExpenses: number,
  isFpContribution: boolean,
  accidentContributionRate: number,
  employerPpkContributionRate: number,
  employeePpkContributionRate: number,
}

