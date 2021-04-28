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
   * Podstawa do obliczenia skladki rentowej i emerytalnej
   * @type {number}
   */
  basicAmountForRentAndPension = 0
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
  zusAccidentEmployerRate = 0

  /**
   * Wolna kwota od podatku
   * @type {number}
   */
  freeAmount = constants.FREE_AMOUNT_FOR_TAX

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
    fp: 0,
    fgsp: 0,
  }

  /**
   * Stawka PPK dla pracownika
   * @type {number}
   */
  employeePpkRate = 0

  /**
   * Stawka PPK dla pracodawcy
   * @type {number}
   */
  employerPpkRate = 0

  /**
   * Kwota PPK dla pracownika
   * @type {number}
   */
  employeePpk = 0

  /**
   * Kwota PPK dla pracodawcy
   * @type {number}
   */
  employerPpk = 0

  /**
   * Oblicza podatek dochodowy
   */
  calculateTaxAmount () {
    if (this.gross <= constants.AMOUNT_OF_TAX_THRESHOLD) {
      this.taxAmount = this.basisForTax * this.firstTaxRate - this.USHealthEmployee - this.freeAmount
    } else {
      this.taxAmount = constants.AMOUNT_OF_TAX_THRESHOLD * this.firstTaxRate +
        ((this.basisForTax - constants.AMOUNT_OF_TAX_THRESHOLD) * this.secondTaxRate) -
        this.USHealthEmployee - this.freeAmount
    }

    if (this.taxAmount < 0) {
      this.taxAmount = 0
    }

    this.taxAmount = Math.round(this.taxAmount)
  }

  /**
   * Oblicza podatek dochodowy dla 1. progu
   */
  calculateTaxByFirstTaxRate () {
    this.taxAmount = this.basisForTax * this.firstTaxRate
  }

  /**
   * Oblicza podatek dochodowy dla 2. progu
   */
  calculateTaxBySecondTaxRate () {
    this.taxAmount = this.basisForTax * this.secondTaxRate
  }

  /**
   * Oblicza podstawe do obliczenia podatku
   */
  calculateBasisForTax () {
    const basisForTax = this.gross - this.expenses -
      (this.employeeZus.pension + this.employeeZus.rent + this.employeeZus.sick)

    this.basisForTax = Math.round(basisForTax)
  }

  /**
   * Oblicza kwote netto
   */
  calculateNetAmount () {
    const net = this.gross - this.taxAmount - this.employeePpk -
      (this.employeeZus.pension + this.employeeZus.rent +
        this.employeeZus.sick + this.employeeZus.health)

    this.net = parseFloat(net.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej dla pracownika
   */
  calculateZUSEmployeePension () {
    const pension = constants.ZUS.EMPLOYEE.PENSION_RATE / 100 * this.basicAmountForRentAndPension

    this.employeeZus.pension = parseFloat(pension.toFixed(2))
  }

  /**
   * Oblicza kwote skladki emerytalnej dla pracodawcy
   */
  calculateZUSEmployerPension () {
    const pension = (constants.ZUS.EMPLOYER.PENSION_RATE / 100) * this.basicAmountForRentAndPension

    this.employerZus.pension = parseFloat(pension.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracownika
   */
  calculateZUSEmployeeRent () {
    const rent = (constants.ZUS.EMPLOYEE.RENT_RATE / 100) * this.basicAmountForRentAndPension

    this.employeeZus.rent = parseFloat(rent.toFixed(2))
  }

  /**
   * Oblicza kwote skladki rentowej dla pracodawcy
   */
  calculateZUSEmployerRent () {
    const rent = (constants.ZUS.EMPLOYER.RENT_RATE / 100) * this.basicAmountForRentAndPension

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

    if (this.gross <= constants.CONTRACT_OF_EMPLOYMENT.LUMP_SUM_UP_TO_AMOUNT) {
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
   * Oblicza kwote skladki wypadkowej dla pracodawcy
   */
  calculateZUSEmployerAccident () {
    const accident = this.zusAccidentEmployerRate *
      this.gross

    this.employerZus.accident = parseFloat(accident.toFixed(2))
  }

  /**
   * Oblicza kwote skladki na FP dla pracodawcy
   */
  calculateZUSEmployerFP () {
    const fp = constants.ZUS.EMPLOYER.FP_RATE / 100 *
      this.gross

    this.employerZus.fp = parseFloat(fp.toFixed(2))
  }

  /**
   * Oblicza kwote skladki na FGSP dla pracodawcy
   */
  calculateZUSEmployerFGSP () {
    const fgsp = constants.ZUS.EMPLOYER.FGSP_RATE / 100 *
      this.gross

    this.employerZus.fgsp = parseFloat(fgsp.toFixed(2))
  }

  /**
   * Oblicza kwote PPK dla pracownika
   */
  calculateEmployeePpk () {
    const ppk = this.employeePpkRate *
      this.gross

    this.employeePpk = parseFloat(ppk.toFixed(2))
  }

  /**
   * Oblicza kwote PPK dla pracodawcy
   */
  calculateEmployerPpk () {
    const ppk = this.employerPpkRate *
      this.gross

    this.employerPpk = parseFloat(ppk.toFixed(2))
  }

  /**
   * Oblicza wszystkie skladowe
   * @param young
   * @param fp
   * @param ppk
   */
  calculateAll (young, fp, ppk) {
    this.basicAmountForRentAndPension = this.gross

    if (this.basicAmountForRentAndPension > constants.AMOUNT_OF_TAX_THRESHOLD) {
      this.basicAmountForRentAndPension = constants.AMOUNT_OF_TAX_THRESHOLD
    }

    this.calculateZUSEmployerAccident()

    this.calculateZUSEmployeePension()
    this.calculateZUSEmployerPension()

    this.calculateZUSEmployeeRent()
    this.calculateZUSEmployerRent()

    this.calculateZUSEmployeeSick()

    this.calculateZUSEmployeeHealth()
    this.calculateUSEmployeeHealth()

    this.calculateBasisForTax()
    this.calculateTaxAmount()

    if (young) {
      this.taxAmount = 0
      this.basisForTax = 0
      this.expenses = 0
    }

    if (ppk) {
      this.calculateEmployeePpk()
      this.calculateEmployerPpk()
    }

    this.calculateNetAmount()

    if (fp) {
      this.calculateZUSEmployerFGSP()
      this.calculateZUSEmployerFP()
    }
  }
}
export default ContractOfEmployment
