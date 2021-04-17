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
   * Stawka podatku liniowego
   */
  linearTaxRate = constants.TAX_RATES.LINEAR_RATE / 100
  /**
   * Kwota podatku
   * @type {number}
   */
  taxAmount = 0
  /**
   * Forma opodatkowania
   * @type {string}
   */
  taxType = constants.TAX_TYPES.GENERAL
  /**
   * Stawka podatku dla ryczałtu
   * @type {number}
   */
  taxRateForLumpSum = 0
  /**
   * Podstawa do obliczenia podatku
   * @type {number}
   */
  basisForTax = 0
  /**
   * Podstawa do obliczenia skladek Zus
   * @type {number}
   */
  basisForZus = 0
  /**
   * Podstawa do obliczenia skladki zdrowotnej
   * @type {number}
   */
  basisForHealth = constants.ZUS.OWNER.BASIS_AMOUNT_FOR_HEALTH
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
   * Kwota skladki zdrowotnej dla potrzeb urzedu skarbowego
   * @type {number}
   */
  USHealth = 0
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
   * @type {{health: number, pension: number, fp: number, sick: number, rent: number, accident: number}}
   */
  zus = {
    accident: 0,
    health: 0,
    sick: 0,
    rent: 0,
    pension: 0,
    fp: 0,
  }

  /**
   * Oblicza podatek dochodowy
   */
  calculateTaxAmount () {
    if (this.taxType === constants.TAX_TYPES.GENERAL) {
      if (this.gross <= constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.taxAmount = this.basisForTax * this.firstTaxRate - this.USHealth - this.freeAmount
      } else {
        this.taxAmount = constants.AMOUNT_OF_TAX_THRESHOLD * this.firstTaxRate +
          (this.basisForTax - constants.AMOUNT_OF_TAX_THRESHOLD) * this.secondTaxRate -
          this.USHealth - this.freeAmount
      }
    }

    if (this.taxType === constants.TAX_TYPES.LINEAR) {
      this.taxAmount = this.basisForTax * this.linearTaxRate - this.USHealth
    }

    if (this.taxType === constants.TAX_TYPES.LUMP_SUM) {
      this.taxAmount = this.basisForTax * this.taxRateForLumpSum - this.USHealth
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
    let basisForTax

    if (this.taxType === constants.TAX_TYPES.LUMP_SUM) {
      basisForTax = this.gross - this.expenses -
        (this.zus.pension + this.zus.rent + this.zus.sick + this.zus.accident)
    } else {
      basisForTax = this.gross - this.expenses -
        (this.zus.pension + this.zus.rent + this.zus.sick + this.zus.accident + this.zus.fp)
    }

    this.basisForTax = parseFloat(basisForTax.toFixed(2))
  }

  /**
   * Oblicza kwote netto
   */
  calculateNetAmount () {
    const net = this.gross - this.taxAmount -
      (this.zus.pension + this.zus.rent +
        this.zus.sick + this.zus.health + this.zus.fp + this.zus.accident)

    this.net = parseFloat(net.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej
   */
  calculateZUSPension () {
    const pension = constants.ZUS.OWNER.PENSION_RATE / 100 * this.basisForZus

    this.zus.pension = parseFloat(pension.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej
   */
  calculateZUSRent () {
    const rent = (constants.ZUS.OWNER.RENT_RATE / 100) * this.basisForZus

    this.zus.rent = parseFloat(rent.toFixed(2))
  }

  /**
   * Oblicza kwote skladki chorobowej
   */
  calculateZUSSick () {
    const sick = (constants.ZUS.OWNER.SICK_RATE / 100) * this.basisForZus

    this.zus.sick = parseFloat(sick.toFixed(2))
  }

  /**
   * Oblicza kwote skladki zdrowotnej dla ZUS
   */
  calculateZUSHealth () {
    const health = (constants.ZUS.OWNER.HEALTH_RATE / 100) * this.basisForHealth

    this.zus.health = parseFloat(health.toFixed(2))
  }

  /**
   * Oblicza kwote skladki zdrowotnej dla US
   */
  calculateUSHealth () {
    const USHealth = (constants.US.OWNER.HEALTH_RATE / 100) * this.basisForHealth

    this.USHealth = parseFloat(USHealth.toFixed(2))
  }

  /**
   * Oblicza kwote skladki wypadkowej
   */
  calculateZUSAccident () {
    const accident = this.zusAccidentRate *
      this.basisForZus

    this.zus.accident = parseFloat(accident.toFixed(2))
  }

  /**
   * Oblicza kwote skladki na FP dla pracodawcy
   */
  calculateZUSFP () {
    const fp = constants.ZUS.OWNER.FP_RATE / 100 *
      this.basisForZus

    this.zus.fp = parseFloat(fp.toFixed(2))
  }
}

export default SelfEmployment
