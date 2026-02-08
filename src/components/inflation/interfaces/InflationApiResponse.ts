export interface EcbSdmxResponse {
  dataSets: Array<{
    series: {
      [key: string]: {
        observations: {
          [index: string]: Array<number | null>
        }
      }
    }
  }>
  structure: {
    dimensions: {
      observation: Array<{
        id: string
        values: Array<{
          id: string
          name: string
        }>
      }>
    }
  }
}
