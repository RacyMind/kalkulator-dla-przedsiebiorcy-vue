import helpers from 'src/logic/helpers'

export class GeneraLRule {
  public static readonly defaultExpenseRate = 0.2
  public static readonly authorExpenseRate = 0.5
  /**
   * It uses by civil agrreements - contract of mandate and work contract
   */
  public static readonly withoutExpensesUpTo = 200
  /**
   * Over the amount, the tax percentage is increased
   */
  public static readonly taxThreshold = 120000
  /**
   * Over the amount, the tax relief is end
   */
  public static readonly taxReliefLimit = 85528

  protected readonly firstTaxRate = 0.12
  protected readonly secondTaxRate = 0.32
  protected taxFreeAmount = 30000
  protected annualTaxReducingAmount:number

  public constructor() {
    this.annualTaxReducingAmount = this.taxFreeAmount * this.firstTaxRate
  }

  /**
   * Returns the salary amount over the tax relief limit. This amount is important for tax calculations
   */
  public getSalaryAmountOverTaxReliefLimit(grossAmount: number, sumUpGrossAmount:number, hasTaxRelief:boolean): number{
    if(!hasTaxRelief) {
      return grossAmount
    }

    if(sumUpGrossAmount > GeneraLRule.taxReliefLimit) {
      return grossAmount
    }
    if(sumUpGrossAmount + grossAmount > GeneraLRule.taxReliefLimit) {
      return helpers.round(sumUpGrossAmount + grossAmount -  GeneraLRule.taxReliefLimit, 2)
    }

    return 0
  }

  public getAuthorExpenses(basisForAuthorExpenses:number, partOfWorkWithAuthorExpenses: number, hasTaxRelief: boolean, sumUpAuthorExpenses:number):number {
    if (!partOfWorkWithAuthorExpenses) {
      return 0
    }
    if (basisForAuthorExpenses <= 0) {
      return 0
    }

    let realThreshold = GeneraLRule.taxThreshold

    if(hasTaxRelief) {
      // it's reduced because the sum of the tax relief and the expense limit can't be more than the the tax threshold
      realThreshold = GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit
    }

    if(sumUpAuthorExpenses >= realThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForAuthorExpenses * partOfWorkWithAuthorExpenses * GeneraLRule.authorExpenseRate, 2)

    if(expenses + sumUpAuthorExpenses > realThreshold) {
      return realThreshold - sumUpAuthorExpenses
    }

    return expenses
  }

  /**
   *
   * @param partTaxReducingAmount 0 - no tax reducing amount, 1 - the annual tax reducing amount, 12 - the monthly tax reducing amount
   */
  public getIncomeTax(taxBasis:number, sumUpTaxBasis:number, partTaxReducingAmount: number):number {
    let taxAmount:number

    // If the total basis for the tax is grater than the amount of the tax threshold, there is the second tax rate
    if (sumUpTaxBasis > GeneraLRule.taxThreshold) {
      taxAmount = taxBasis * this.secondTaxRate
    } else if (taxBasis + sumUpTaxBasis > GeneraLRule.taxThreshold) {
      // first rate
      taxAmount = (GeneraLRule.taxThreshold - sumUpTaxBasis) * this.firstTaxRate
      // second rate
      taxAmount += (taxBasis + sumUpTaxBasis - GeneraLRule.taxThreshold) * this.secondTaxRate
    } else {
      taxAmount = taxBasis * this.firstTaxRate
    }

    if(partTaxReducingAmount) {
      taxAmount -= this.annualTaxReducingAmount / partTaxReducingAmount
    }

    if (taxAmount < 0) {
      return  0
    }

    return helpers.round(taxAmount)
  }
}
