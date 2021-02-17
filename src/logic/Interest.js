class Interest {
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
   * Kwota odsetek
   * @type {number}
   */
  interest = 0
  /**
   * Stawka procentowa odsetek
   * @type {number}
   */
  rateInterest = 0
  /**
   * Ilosc dni spoznienia
   * @type {number}
   */
  days = 0

  /**
   * Oblicza kwote odsetek
   */
  calculateInterest () {
    this.interest = (this.net * this.rateInterest * this.days) / 365
    this.interest = +this.interest.toFixed(2)
  }

  /**
   * Oblicza kwote brutto
   */
  calculateGross () {
    this.gross = this.net + this.interest
  }
}

export default Interest
