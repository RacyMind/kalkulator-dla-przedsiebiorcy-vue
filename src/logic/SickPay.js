import constants from 'src/logic/constants'

class SickPay {
  /**
   * "Podstawa wymiaru wynagrodzenia chorobowego
   * @type {number}
   */
  basic = 0
  /**
   * Liczba dni zwolnienia
   * @type {number}
   */
  days = 0
  /**
   * Kwota zasiłku chorobowego
   * @type {number}
   */
  amount = 0
  /**
   * Stawka zasiłku chorobowego
   * @type {number}
   */
  rate = 0
  /**
   * Suma procentów składek społecznych
   * @type {number}
   */
  zusRate = (constants.ZUS.EMPLOYEE.RENT_RATE + constants.ZUS.EMPLOYEE.PENSION_RATE + constants.ZUS.EMPLOYEE.SICK_RATE) / 100

  /**
   * Oblicza zasiłek chorobowy
   */
  calculate () {
    let amount = this.basic * (1 - this.zusRate)
    amount = +amount.toFixed(2)
    amount = amount / 30
    amount = +amount.toFixed(2)
    amount = amount * this.rate * this.days

    this.amount = +amount.toFixed(2)
  }
}

export default SickPay
