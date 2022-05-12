import {AvailableYear} from 'src/types/AvailableYear'

export interface ContractOfEmploymentInputFields {
  year: AvailableYear,
  grossAmount: number,
  workInLivePlace: boolean,
  isFreeAmount: boolean,
  isReliefForYoung: boolean,
  isReliefForBigFamily: boolean,
  isReliefForSenior: boolean,
  isReliefForMiddleClass: boolean,
  partOfWorkWithAuthorExpenses: number,
  isFpContribution: boolean,
  accidentContributionRate: number,
  employerPpkContributionRate: number,
  employeePpkContributionRate: number,
}

