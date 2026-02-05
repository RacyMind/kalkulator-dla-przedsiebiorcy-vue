import { BondInputFields } from './interfaces/BondInputFields'
import { CoiInputFields } from './interfaces/CoiInputFields'
import { DorInputFields } from './interfaces/DorInputFields'
import { EdoInputFields } from './interfaces/EdoInputFields'
import { OtsInputFields } from './interfaces/OtsInputFields'
import { Result } from './interfaces/Result'
import { RodInputFields } from './interfaces/RodInputFields'
import { RorInputFields } from './interfaces/RorInputFields'
import { RosInputFields } from './interfaces/RosInputFields'
import { TosInputFields } from './interfaces/TosInputFields'
import { defineStore } from 'pinia'

export type BondType = 'COI' | 'DOR' | 'EDO' | 'OTS' | 'ROD' | 'ROR' | 'ROS' | 'TOS'

export interface PolishBondsState {
  result: Result | null
  selectedBondType: BondType | null
  commonInputFields: BondInputFields | null
  coiInputFields: CoiInputFields | null
  dorInputFields: DorInputFields | null
  edoInputFields: EdoInputFields | null
  otsInputFields: OtsInputFields | null
  rodInputFields: RodInputFields | null
  rorInputFields: RorInputFields | null
  rosInputFields: RosInputFields | null
  tosInputFields: TosInputFields | null
}

export const usePolishBondsStore = defineStore('polishBonds', {
  state: (): PolishBondsState => ({
    result: null,
    selectedBondType: 'EDO',
    commonInputFields: null,
    edoInputFields: null,
    coiInputFields: null,
    tosInputFields: null,
    otsInputFields: null,
    rorInputFields: null,
    dorInputFields: null,
    rosInputFields: null,
    rodInputFields: null,
  }),
})
