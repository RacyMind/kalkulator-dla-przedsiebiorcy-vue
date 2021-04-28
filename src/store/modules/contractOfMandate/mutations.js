export default {
  SET_NET (state, net) {
    state.net = net
  },
  SET_GROSS (state, gross) {
    state.gross = gross
  },
  SET_TAX (state, tax) {
    state.tax = tax
  },
  SET_BASIS_FOR_TAX (state, basisForTax) {
    state.basisForTax = basisForTax
  },
  SET_EXPENSES (state, expenses) {
    state.expenses = expenses
  },
  SET_EMPLOYEE_ZUS (state, employeeZus) {
    state.employeeZus = employeeZus
  },
  SET_EMPLOYER_ZUS (state, employerZus) {
    state.employerZus = employerZus
  },
  SET_EMPLOYEE_PPK (state, employeePpk) {
    state.employeePpk = employeePpk
  },
  SET_EMPLOYER_PPK (state, employerPpk) {
    state.employerPpk = employerPpk
  },
  CLEAR_DATA (state) {
    state.net = null
    state.gross = null
    state.basisForTax = null
    state.expenses = null
    state.tax = null
    state.employeeZus = {
      health: null,
      sick: null,
      rent: null,
      pension: null,
    }
    state.employerZus = {
      accident: null,
      rent: null,
      pension: null,
    }
    state.employeePpk = null
    state.employerPpk = null
  },
}
