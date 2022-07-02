export default {
  CLEAR_DATA (state) {
    state.basisForZus = null
    state.zus = {
      accident: null,
      fp: null,
      health: null,
      pension: null,
      rent: null,
      sick: null,
    }
  },
  SET_BASIS_FOR_ZUS (state, basisForZus) {
    state.basisForZus = basisForZus
  },
  SET_ZUS (state, zus) {
    state.zus = zus
  },
}
