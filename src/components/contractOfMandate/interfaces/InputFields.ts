import {HasGrossAmount} from 'src/logic/interfaces/HasGrossAmount'

export interface InputFields extends HasGrossAmount{
  canLumpSumTaxBe: boolean,
  accidentContributionRate: number,
  employerPpkContributionRate: number,
  employeePpkContributionRate: number,
  hasTaxRelief: boolean,
  isDisabilityContribution: boolean,
  isFpContribution: boolean,
  isHealthContribution: boolean,
  isPensionContribution: boolean,
  isSickContribution: boolean,
  partOfWorkWithAuthorExpenses: number,
  partTaxReducingAmount: number,
}

