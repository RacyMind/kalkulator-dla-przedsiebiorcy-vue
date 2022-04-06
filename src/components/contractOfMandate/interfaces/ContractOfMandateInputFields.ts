import {AvailableYear} from 'src/types/AvailableYear'

export interface ContractOfMandateInputFields {
  year: AvailableYear
  grossAmount: number
  isFreeAmount: boolean,
  isReliefForYoung: boolean,
  partOfWorkWithAuthorExpenses: number,
  isHealthContribution: boolean,
  isSickContribution: boolean,
  isDisabilityContribution: boolean,
  isPensionContribution: boolean,
  isFpContribution: boolean,
  accidentContributionRate: number,
  employerPpkContributionRate: number,
  employeePpkContributionRate: number,
}

