export interface ContractWorkResult {
  readonly netAmount: number,
  readonly grossAmount: number,
  readonly basisForTax: number,
  readonly expenses: number,
  readonly taxAmount: number,
}
