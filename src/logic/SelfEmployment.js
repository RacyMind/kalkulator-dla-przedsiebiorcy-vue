import constants from 'src/logic/constants'

class SelfEmployment {
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
   * Stawka podatku dla 1. progu
   * @type {number}
   */
  firstTaxRate = constants.TAX_RATES.FIRST_RATE / 100
  /**
   * Stawka podatku dla 2. progu
   * @type {number}
   */
  secondTaxRate = constants.TAX_RATES.SECOND_RATE / 100
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
  expensesRate = 0
  /**
   * Kwota skladki zdrowotnej pracownika dla potrzeb urzedu skarbowego
   * @type {number}
   */
  USHealthEmployee = 0
  /**
   * Stawka procentowa skladki wypadkowej
   * @type {number}
   */
  zusAccidentRate = 0

  /**
   * Wolna kwota od podatku
   * @type {number}
   */
  freeAmount = constants.FREE_AMOUNT_FOR_TAX

  /**
   * Skłądki ZUS dla właściciela
   * @type {{fgsp: number, health: number, pension: number, fp: number, sick: number, rent: number, accident: number}}
   */
  zus = {
    accident: 0,
    health: 0,
    sick: 0,
    rent: 0,
    pension: 0,
    fp: 0,
    fgsp: 0,
  }

  /**
   * Oblicza podatek dochodowy
   */
  calculateTaxAmount () {
    if (this.gross <= constants.AMOUNT_OF_TAX_THRESHOLD) {
      this.taxAmount = this.basisForTax * this.firstTaxRate - this.USHealthEmployee - this.freeAmount
    } else {
      this.taxAmount = constants.AMOUNT_OF_TAX_THRESHOLD * this.firstTaxRate +
        (this.basisForTax - constants.AMOUNT_OF_TAX_THRESHOLD) * this.secondTaxRate -
        this.USHealthEmployee - this.freeAmount
    }

    if (this.taxAmount < 0) {
      this.taxAmount = 0
    }

    this.taxAmount = Math.round(this.taxAmount)
  }

  /**
   * Oblicza podstawe do obliczenia podatku
   */
  calculateBasisForTax () {
    const basisForTax = this.gross - this.expenses -
      (this.zus.pension + this.zus.rent + this.zus.sick)

    this.basisForTax = parseFloat(basisForTax.toFixed(2))
  }

  /**
   * Oblicza kwote netto
   */
  calculateNetAmount () {
    const net = this.gross - this.taxAmount -
      (this.zus.pension + this.zus.rent +
        this.zus.sick + this.zus.health)

    this.net = parseFloat(net.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej
   */
  calculateZUSPension () {
    const pension = constants.ZUS.OWNER.PENSION_RATE / 100 * this.gross

    this.zus.pension = parseFloat(pension.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej
   */
  calculateZUSRent () {
    const rent = (constants.ZUS.OWNER.RENT_RATE / 100) * this.gross

    this.zus.rent = parseFloat(rent.toFixed(2))
  }

  /**
   * Oblicza kwote skladki chorobowej
   */
  calculateZUSSick () {
    const sick = (constants.ZUS.OWNER.SICK_RATE / 100) * this.gross

    this.zus.sick = parseFloat(sick.toFixed(2))
  }

  /**
   * Oblicza kwote skladki zdrowotnej dla ZUS
   */
  calculateZUSHealth () {
    const health = (constants.ZUS.OWNER.HEALTH_RATE / 100) *
      (this.gross - (this.zus.pension +
        this.zus.rent + this.zus.sick))

    this.zus.health = parseFloat(health.toFixed(2))
  }

  /**
   * Oblicza kwote skladki zdrowotnej dla US
   */
  calculateUSHealth () {
    let USHealthEmployee

    if (this.gross <= constants.CONTRACT_OF_EMPLOYMENT.LUMP_SUM_UP_TO_AMOUNT) {
      USHealthEmployee = (constants.ZUS.OWNER.HEALTH_RATE / 100) *
        (this.gross - (this.zus.pension +
          this.zus.rent + this.zus.sick))
    } else {
      USHealthEmployee = (constants.US.OWNER.HEALTH_RATE / 100) *
        (this.gross - (this.zus.pension +
          this.zus.rent + this.zus.sick))
    }

    this.USHealthEmployee = parseFloat(USHealthEmployee.toFixed(2))
  }

  /**
   * Oblicza kwote skladki wypadkowej
   */
  calculateZUSAccident () {
    const accident = this.zusAccidentRate *
      this.gross

    this.zus.accident = parseFloat(accident.toFixed(2))
  }

  /**
   * Oblicza kwote skladki na FP dla pracodawcy
   */
  calculateZUSFP () {
    const fp = constants.ZUS.OWNER.FP_RATE / 100 *
      this.gross

    this.zus.fp = parseFloat(fp.toFixed(2))
  }

  /**
   * Oblicza kwote skladki na FGSP dla pracodawcy
   */
  calculateZUSFGSP () {
    const fgsp = constants.ZUS.OWNER.FGSP_RATE / 100 *
      this.gross

    this.zus.fgsp = parseFloat(fgsp.toFixed(2))
  }
}
export default SelfEmployment
