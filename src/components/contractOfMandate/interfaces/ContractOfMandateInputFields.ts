import {AvailableYear} from 'src/types/AvailableYear'

export interface ContractOfMandateInputFields {
  year: AvailableYear
  grossAmount: number
  isReliefForYoung: boolean,
  partOfWorkWithAuthorExpenses: number,
  isHealthContribution: boolean,
  isSickContribution: boolean,
  isDisabilityContribution: boolean,
  isPensionContribution: boolean,
  accidentContributionRate: number,
  employerPpkContributionRate: number,
  employeePpkContributionRate: number,
}

