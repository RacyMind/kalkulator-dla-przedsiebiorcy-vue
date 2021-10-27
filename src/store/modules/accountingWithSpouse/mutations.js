export default {
  setMyData (state, myData) {
    state.myData = myData
  },
  setMyAccountingForm (state, myAccountingForm) {
    state.myAccountingForm = myAccountingForm
  },
  setSpouseData (state, spouseData) {
    state.spouseData = spouseData
  },
  setSpouseAccountingForm (state, spouseAccountingForm) {
    state.spouseAccountingForm = spouseAccountingForm
  },
  clearAllData (state) {
    state.myData = null
    state.myAccountingForm = null
    state.spouseData = null
    state.spouseAccountingForm = null
  },
}
