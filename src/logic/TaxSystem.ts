export class TaxSystem {
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
   * Over the amount, the young aid is end
   */
  public static readonly aidThreshold = 8528
}
