import {ContributionBasises} from 'src/composables/contributionBasises'
import {ContributionScheme} from 'components/accountingWithSpouse/logic/ContributionScheme'

export enum FormType{
  EmploymentContract = 1,
  Entrepreneur = 2,
  Custom = 3,
  Unemployment = 4,
}

export interface EmployeeFormFields{
  grossAmount: number
  hasAmountForEachMonth: boolean
  grossAmounts: number[]
  hasTaxRelief: boolean
  workInLivePlace: boolean
  contributionScheme: ContributionScheme
  isDisabilityContribution: boolean
  isHealthContribution: boolean
  isPensionContribution: boolean
  isSickContribution: boolean
  isPpkContribution: boolean
  employerPpkContributionRate: number
  employeePpkContributionRate: number
}

export interface EntrepreneurFormFields{
  revenue: number
  hasRevenueForEachMonth: boolean
  revenueAmounts: number[]
  expenses: number
  hasExpensesForEachMonth: boolean
  expensesAmounts: number[]
  hasTaxRelief: boolean
  chosenContributionBasis: ContributionBasises
  customContributionBasis: number
  hasEmploymentContract:boolean
  isSickContribution: boolean
  accidentContributionRate: number
  isFpContribution: boolean
  healthContributionBasisInJanuary: number
}

export interface CustomFormFields{
  revenue: number
  socialContributions: number
  healthContributions: number
  expenses: number
  hasTaxRelief: boolean
}

export interface FormFields{
  formType: FormType
  custom: CustomFormFields
  employee: EmployeeFormFields
  entrepreneur: EntrepreneurFormFields
}
