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
}
