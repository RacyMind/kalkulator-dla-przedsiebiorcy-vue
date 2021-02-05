class Invoice {
  /**
   * @Kwota netto
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
   * Stawka podatku
   * @type {number}
   */
  rateTax = 0
  /**
   * Oblicza kwotę podatku
   */
  calculateTaxAmount () {
    this.taxAmount = this.net * this.rateTax
  }

  /**
   * Oblicza kwotę netto
   */
  calculateNet () {
    this.net = this.gross / (1 + this.rateTax)
  }

  /**
   * Oblicza kwotę netto
   */
  calculateGross () {
    this.gross = this.net + this.taxAmount
  }
}
export default Invoice
