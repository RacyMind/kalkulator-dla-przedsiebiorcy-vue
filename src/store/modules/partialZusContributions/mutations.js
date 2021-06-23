export default {
  SET_ZUS (state, zus) {
    state.zus = zus
  },
  SET_BASIS_FOR_ZUS (state, basisForZus) {
    state.basisForZus = basisForZus
  },
  CLEAR_DATA (state) {
    state.basisForZus = null
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
