import constants from 'src/logic/constants'

class CashRegisterLimit {
  /**
   * Kwota limitu
   * @type {number}
   */
  amount = 0
  /**
   * Dzień roku
   * @type {number}
   */
  dayOfYear = 0
  /**
   * Kwota odsetek
   * @type {number}
   */
  daysOfYear = 365

  /**
   * Oblicza kwote limitu
   */
  calculate () {
    this.amount = constants.CASH_REGISTER_LIMIT * this.dayOfYear / this.daysOfYear
    this.amount = +this.amount.toFixed(2)
  }
}

export default CashRegisterLimit
