export abstract class BasicCalculator<InputFieldType, ResultType>{
  protected inputData: InputFieldType | undefined
  protected result: ResultType | undefined

  protected getInputData():InputFieldType {
    if( this.inputData === undefined) {
      throw Error('The input data is undefined!')
    }
    return this.inputData
  }

  public setInputData(input: InputFieldType): this {
    this.inputData = input
    return this
  }

  public getResult(): ResultType {
    if( this.result === undefined) {
      throw Error('The result is undefined!')
    }
    return this.result
  }
}
