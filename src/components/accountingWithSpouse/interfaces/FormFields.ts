export enum FormType{
  EmploymentContract = 1,
  Entrepreneur = 2,
  Custom = 3,
  Unemployment = 4,
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
