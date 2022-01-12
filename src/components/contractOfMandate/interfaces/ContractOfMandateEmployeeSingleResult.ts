export interface ContractOfMandateEmployeeSingleResult {
  readonly netAmount: number,
  readonly grossAmount: number,
  readonly basisForTax: number,
  readonly expenses: number,
  readonly taxAmount: number,
  readonly basisForRentAndPensionContributions: number,
  readonly healthContribution: number,
  readonly sickContribution: number,
  readonly rentContribution: number,
  readonly pensionContribution: number,
  readonly ppkContribution: number,
  readonly contributionTotal: number,
}
