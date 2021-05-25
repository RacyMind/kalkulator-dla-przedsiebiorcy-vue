import constants from 'src/logic/constants'

class UnregisteredCompany {
  /**
   * Kwota netto
   * @type {number}
   */
  net = 0
  /**
   * Kwota brutto
   * @type {number}
   */
  gross = 0
  /**
   * Kwota podatku
   * @type {number}
   */
  taxAmount = 0

  /**
   * Podstawa do obliczenia podatku
   * @type {number}
   */
  basisForTax = 0

  /**
   * Koszty uzyskania przychodu
   * @type {number}
   */
  expenses = 0

  /**
   * Stawka podatku
   * @type {number}
   */
  taxRate = constants.TAX_RATES.FIRST_RATE / 100

  /**
   * Oblicza podstawę opodatkowania
   */
  calculateBasisForTax () {
    this.basisForTax = Math.round(this.gross - this.expenses)
  }

  /**
   * Oblicza kwotę podatku
   */
  calculateTaxAmount () {
    this.taxAmount = Math.round(this.basisForTax * this.taxRate)
  }

  /**
   * Oblicza kwotę netto
   */
  calculateNet () {
    this.net = this.gross - this.taxAmount
  }

  /**
   * Obliczenia dla kwoty brutto
   */
  calculateAll () {
    this.calculateBasisForTax()
    this.calculateTaxAmount()
    this.calculateNet()
  }
}
export default UnregisteredCompany
