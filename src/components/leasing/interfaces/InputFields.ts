import {
  AssetType,
  EmissionCategory,
  VatDeductionRate,
} from 'components/leasing/types/LeasingTypes'
import { AvailableVatRate } from 'src/logic/taxes/interfaces/AvailableVatRate'

export interface InputFields {
  netAssetValue: number
  initialPaymentRate: number
  installmentCount: number
  residualValueRate: number
  annualInterestRate: number
  assetType: AssetType
  emissionCategory: EmissionCategory
  vatDeductionRate: VatDeductionRate
  vatRate: AvailableVatRate
}
