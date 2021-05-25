import constants from 'src/logic/constants'

class VatLimit {
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
    this.amount = constants.CASH_REGISTER_LIMIT * (this.daysOfYear - this.dayOfYear + 1) / this.daysOfYear
    this.amount = +this.amount.toFixed(2)
  }
}

export default VatLimit
