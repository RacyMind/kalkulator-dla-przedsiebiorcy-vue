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
  SET_FREE_AMOUNT (state, freeAmount) {
    state.freeAmount = freeAmount
  },
  SET_BASIS_FOR_TAX (state, basisForTax) {
    state.basisForTax = basisForTax
  },
  SET_EXPENSES (state, expenses) {
    state.expenses = expenses
  },
  SET_ZUS (state, zus) {
    state.zus = zus
  },
  SET_ZUS_ACCIDENT_RATE (state, zusAccidentRate) {
    state.zusAccidentRate = zusAccidentRate
  },
  SET_TAX_TYPE (state, taxType) {
    state.taxType = taxType
  },
  SET_AID (state, aid) {
    state.aid = aid
  },
  SET_SICK (state, sick) {
    state.sick = sick
  },
  CLEAR_DATA (state) {
    state.net = null
    state.gross = null
    state.basisForTax = null
    state.expenses = null
    state.freeAmount = null
    state.tax = null
    state.taxType = null
    state.zusAccidentRate = null
    state.aid = false
    state.sick = false
    state.zus = {
      accident: null,
      health: null,
      sick: null,
      rent: null,
      pension: null,
      fp: null,
    }
  },
}
