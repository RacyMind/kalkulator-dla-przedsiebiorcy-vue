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
  taxRate = constants.TAX_RATES.FIRST_RATE / 100
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
   * Jaka część pracy na autorskie koszty uzyskania przychodu
   * @type {number}
   */
  authorExpensePart = 0
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
    this.taxAmount = this.basisForTax * this.taxRate

    if (this.gross > constants.LUMP_SUM_UP_TO_AMOUNT) {
      this.taxAmount -= this.USHealthEmployee
    }

    this.taxAmount = Math.round(this.taxAmount)
  }

  /**
   * Oblicza koszty uzyskania przychodu
   */
  calculateExpenses () {
    let expenses = 0
    const basicForExpenses = this.gross - (this.employeeZus.pension +
      this.employeeZus.rent + this.employeeZus.sick)

    if (this.authorExpensePart) {
      expenses = basicForExpenses * this.authorExpensePart * constants.CONTRACT_OF_MANDATE.AUTHOR_EXPENSES_RATE
    }

    expenses += basicForExpenses * (1 - this.authorExpensePart) * this.expensesRate

    if (expenses > constants.AMOUNT_OF_TAX_THRESHOLD) {
      expenses = constants.AMOUNT_OF_TAX_THRESHOLD
    }

    this.expenses = parseFloat(expenses.toFixed(2))
  }

  /**
   * Oblicza podstawe do obliczenia podatku
   */
  calculateBasisForTax () {
    let basisForTax

    if (this.gross > constants.LUMP_SUM_UP_TO_AMOUNT) {
      basisForTax = this.gross - this.expenses -
        (this.employeeZus.pension + this.employeeZus.rent + this.employeeZus.sick)
    } else {
      basisForTax = this.gross
    }

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

    if (this.gross <= constants.LUMP_SUM_UP_TO_AMOUNT) {
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
    const accident = this.zusAccidentEmployerRate *
      this.gross

    this.employerZus.accident = parseFloat(accident.toFixed(2))
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
   *
   * @param accident
   * @param pension
   * @param rent
   * @param sick
   * @param health
   * @param young
   */
  calculateAll (accident, pension, rent, sick, health, young, ppk) {
    this.basicAmountForRentAndPension = this.gross

    if (this.gross > constants.LUMP_SUM_UP_TO_AMOUNT) {
      this.expensesRate = constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
    }

    if (accident) {
      this.calculateZUSEmployerAccident()
    }

    if (pension) {
      this.calculateZUSEmployeePension()
      this.calculateZUSEmployerPension()
    }

    if (rent) {
      this.calculateZUSEmployeeRent()
      this.calculateZUSEmployerRent()
    }

    if (sick) {
      this.calculateZUSEmployeeSick()
    }

    this.calculateExpenses()

    if (health) {
      this.calculateZUSEmployeeHealth()
      this.calculateUSEmployeeHealth()
    }

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
  }
}
export default ContractOfMandate
