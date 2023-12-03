export interface Calculator<InputDataType, ResultType>{
  calculate():this
  setInputData(input: InputDataType):this
  getResult():ResultType
}
