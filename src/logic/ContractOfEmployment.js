import constants from 'src/logic/constants'

class ContractOfEmployment {
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
   * Kwota skladki zdrowotnej pracownika dla potrzeb urzedu skarbowego
   * @type {number}
   */
  USHealthEmployee = 0
  /**
   * Stawka procentowa skladki wypadkowej
   * @type {number}
   */
  rateZUSAccidentEmployer = 0

  /**
   * Skłądki ZUS dla pracownika
   * @type {{health: number, pension: number, sick: number, rent: number}}
   */
  employeeZus = {
    health: 0,
    sick: 0,
    rent: 0,
    pension: 0,
  }

  /**
   * Skłądki ZUS dla pracodawcy
   * @type {{pension: number, rent: number, accident: number}}
   */
  employerZus = {
    rent: 0,
    accident: 0,
    pension: 0,
  }

  /**
   * Oblicza podatek dochodowy
   */
  calculateTaxAmount () {
    this.taxAmount = this.basisForTax * this.rateTax

    if (this.gross > constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
      this.taxAmount -= this.USHealthEmployee
    }

    this.taxAmount = Math.round(this.taxAmount)
  }

  /**
   * Oblicza koszty uzyskania przychodu
   */
  calculateExpenses () {
    const expenses = (this.gross - (this.employeeZus.pension +
      this.employeeZus.rent + this.employeeZus.sick)) * this.rateExpenses

    this.expenses = parseFloat(expenses.toFixed(2))
  }

  /**
   * Oblicza podstawe do obliczenia podatku
   */
  calculateBasisForTax () {
    let basisForTax

    if (this.gross > constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
      basisForTax = this.gross - this.expenses -
        (this.employeeZus.pension + this.employeeZus.rent + this.employeeZus.sick)
    } else {
      basisForTax = this.gross
    }

    this.basisForTax = parseFloat(basisForTax.toFixed(2))
  }

  /**
   * Oblicza kwote netto
   */
  calculateNetAmount () {
    const net = this.gross - this.taxAmount -
      (this.employeeZus.pension + this.employeeZus.rent +
        this.employeeZus.sick + this.employeeZus.health)

    this.net = parseFloat(net.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej dla pracownika
   */
  calculateZUSEmployeePension () {
    const pension = constants.ZUS.EMPLOYEE.PENSION_RATE / 100 * this.gross

    this.employeeZus.pension = parseFloat(pension.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej dla pracodawcy
   */
  calculateZUSEmployerPension () {
    const pension = (constants.ZUS.EMPLOYER.PENSION_RATE / 100) * this.gross

    this.employerZus.pension = parseFloat(pension.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracownika
   */
  calculateZUSEmployeeRent () {
    const rent = (constants.ZUS.EMPLOYEE.RENT_RATE / 100) * this.gross

    this.employeeZus.rent = parseFloat(rent.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracodawcy
   */
  calculateZUSEmployerRent () {
    const rent = (constants.ZUS.EMPLOYER.RENT_RATE / 100) * this.gross

    this.employerZus.rent = parseFloat(rent.toFixed(2))
  }

  /**
   * Oblicza kwote skladki chorobowej dla pracownika
   */
  calculateZUSEmployeeSick () {
    const sick = (constants.ZUS.EMPLOYEE.SICK_RATE / 100) * this.gross

    this.employeeZus.sick = parseFloat(sick.toFixed(2))
  }

  /**
   * Oblicza kwote skladki zdrowotnej dla ZUS
   */
  calculateZUSEmployeeHealth () {
    const health = (constants.ZUS.EMPLOYEE.HEALTH_RATE / 100) *
      (this.gross - (this.employeeZus.pension +
        this.employeeZus.rent + this.employeeZus.sick))

    this.employeeZus.health = parseFloat(health.toFixed(2))
  }

  /**
   * Oblicza kwote skladki zdrowotnej dla US
   */
  calculateUSEmployeeHealth () {
    let USHealthEmployee

    if (this.gross <= constants.CONTRACT_OF_MANDATE.LUMP_SUM_UP_TO_AMOUNT) {
      USHealthEmployee = (constants.ZUS.EMPLOYEE.HEALTH_RATE / 100) *
        (this.gross - (this.employeeZus.pension +
          this.employeeZus.rent + this.employeeZus.sick))
    } else {
       USHealthEmployee = (constants.US.EMPLOYEE.HEALTH_RATE / 100) *
         (this.gross - (this.employeeZus.pension +
           this.employeeZus.rent + this.employeeZus.sick))
    }

    this.USHealthEmployee = parseFloat(USHealthEmployee.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracodawcy
   */
  calculateZUSEmployerAccident () {
    const accident = this.rateZUSAccidentEmployer *
      this.gross

    this.employerZus.accident = parseFloat(accident.toFixed(2))
  }
}
export default ContractOfEmployment
