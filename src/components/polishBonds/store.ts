import {Result} from 'components/polishBonds/interfaces/Result'
import {defineStore} from 'pinia'
import {ref} from 'vue'

export type BondType = 'EDO' | 'COI' | 'TOS' | 'ROR' | 'DOR' | 'OTS'

export interface PolishBondsState {
  result: Result | null
  selectedBondType: BondType
  bondCount: number
}

export const usePolishBondsStore = defineStore('polishBonds', () => {
  const result = ref<Result | null>(null)
  const selectedBondType = ref<BondType>('EDO')
  const bondCount = ref<number>(1)

  return {
    result,
    selectedBondType,
    bondCount,
  }
})
