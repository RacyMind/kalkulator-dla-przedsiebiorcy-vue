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
  CLEAR_DATA (state) {
    state.net = null
    state.gross = null
    state.tax = null
  },
}
