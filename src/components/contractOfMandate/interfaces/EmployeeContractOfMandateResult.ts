export interface EmployeeContractOfMandateResult {
  readonly healthContribution:number,
  readonly sickContribution: number,
  readonly disabilityContribution: number,
  readonly pensionContribution: number,
  readonly ppkContribution: number,
  readonly expenses: number,
  readonly taxBasis: number,
  readonly taxAmount: number
  readonly grossAmount: number
  readonly netAmount: number
}
