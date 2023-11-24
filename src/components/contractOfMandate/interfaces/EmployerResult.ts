import {EmployerZusResult} from 'src/logic/zus/interfaces/EmployerZusResult'

export interface EmployerResult extends EmployerZusResult{
  readonly grossAmount: number,
  readonly totalAmount: number,
}
