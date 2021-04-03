import constants from 'src/logic/constants'

class ContractOfMandate {
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
   * Stawka podatku
   * @type {number}
   */
  rateTax = constants.TAX_RATES.FIRST_RATE / 100
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
   * Stawka kosztow uzyskania przychodu
   * @type {number}
   */
  rateExpenses = 0
  /**
   * Kwota skladki zdrowotnej pracownika
   * @type {number}
   */
  ZUSHealthEmployee = 0
  /**
   * Kwota skladki zdrowotnej pracownika dla potrzeb urzedu skarbowego
   * @type {number}
   */
  USHealthEmployee = 0
  /**
   * Kwota skladki emerytalnej pracownika
   * @type {number}
   */
  ZUSPensionEmployee = 0
  /**
   * Kwota skladki emerytalnej pracodawcy
   * @type {number}
   */
  ZUSPensionEmployer = 0
  /**
   * Kwota skladki rentowej pracownika
   * @type {number}
   */
  ZUSRentEmployee = 0
  /**
   * Kwota skladki wypadkowej pracodwacy
   * @type {number}
   */
  ZUSAccidentEmployer = 0
  /**
   * Stawka procentowa skladki wypadkowej
   * @type {number}
   */
  rateZUSAccidentEmployer = 0
  /**
   * Kwota skladki chorobowej pracownika
   * @type {number}
   */
  ZUSSickEmployee = 0
  /**
   * Kwota skladki rentowej pracodawcy
   * @type {number}
   */
  ZUSRentEmployer = 0

  /**
   * Oblicza podatek dochodowy
   */
  calculateTaxAmount () {
    this.taxAmount = this.basisForTax * this.rateTax

    if (this.gross > 200) {
      this.taxAmount -= this.USHealthEmployee
    }

    this.taxAmount = Math.round(this.taxAmount)
  }

  /**
   * Oblicza koszty uzyskania przychodu
   */
  calculateExpenses () {
    const expenses = (this.gross - (this.ZUSPensionEmployee +
      this.ZUSRentEmployee + this.ZUSSickEmployee)) * this.rateExpenses

    this.expenses = parseFloat(expenses.toFixed(2))
  }

  /**
   * Oblicza podstawe do obliczenia podatku
   */
  calculateBasisForTax () {
    let basisForTax

    if (this.gross > 200) {
      basisForTax = this.gross - this.expenses -
      (this.ZUSPensionEmployee + this.ZUSRentEmployee + this.ZUSSickEmployee)
    } else {
      basisForTax = this.gross
    }

    this.basisForTax = parseFloat(basisForTax.toFixed(2))
  }

  /**
   * Oblicza kwote netto
   */
  calculateNet () {
   const net = this.gross - this.taxAmount -
    (this.ZUSPensionEmployee + this.ZUSRentEmployee +
    this.ZUSSickEmployee + this.ZUSHealthEmployee)

    this.net = parseFloat(net.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej dla pracownika
   */
  calclulateZUSPensionEmployee () {
    const ZUSPensionEmployee = constants.ZUS.EMPLOYEE.RATE_PENSION / 100 * this.gross

    this.ZUSPensionEmployee = parseFloat(ZUSPensionEmployee.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej dla pracodawcy
   */
  calclulateZUSPensionEmployer () {
    const ZUSPensionEmployer = (constants.ZUS.EMPLOYER.RATE_PENSION / 100) * this.gross

    this.ZUSPensionEmployer = parseFloat(ZUSPensionEmployer.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracownika
   */
  calclulateZUSRentEmployee () {
    const ZUSRentEmployee = (constants.ZUS.EMPLOYEE.RATE_RENT / 100) * this.gross

    this.ZUSRentEmployee = parseFloat(ZUSRentEmployee.toFixed(2))
  }

  /**
   * Oblicza kwote skladki chorobowej dla pracownika
   */
  calclulateZUSSickEmployee () {
    this.ZUSSickEmployee = round((rateZUSSickEmployee / 100) * this.gross, 2)

    this.net = parseFloat(net.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracodawcy
   */
  calclulateZUSRentEmployer () {
    this.ZUSRentEmployer = round((rateZUSRentEmployer / 100) * this.gross, 2)

    this.net = parseFloat(net.toFixed(2))
  }
}
export default ContractOfMandate
