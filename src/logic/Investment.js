import constants from 'src/logic/constants'

class Investment {
  /**
   * Kapitał
   * @type {number}
   */
  amount = 0
  /**
   * Kwota netto
   * @type {number}
   */
  net = 0
  /**
   * Odsetki brutto
   * @type {number}
   */
  gross = 0
  /**
   * Kwota podatku
   * @type {number}
   */
  tax = 0
  /**
   * Stawka procentowa odsetek
   * @type {number}
   */
  rateInterest = 0
  /**
   * Ilosc miesięcy
   * @type {number}
   */
  months = 0

  /**
   * Oblicza odsetki brutto
   */
  calculateInterest () {
    this.gross = (this.amount * this.rateInterest * this.months) / 12
    this.gross = +this.gross.toFixed(2)
  }

  /**
   * Oblicza podatek
   */
  calculateTax () {
    this.tax = this.gross * constants.TAX_RATES.BELKA_RATE / 100
    this.tax = +this.tax.toFixed(2)
  }

  /**
   * Oblicza odsetki netto
   */
  calculateNet () {
    this.net = this.gross - this.tax
  }
}

export default Investment
