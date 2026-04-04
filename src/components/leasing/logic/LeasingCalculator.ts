import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'
import { InputFields } from 'components/leasing/interfaces/InputFields'
import { Result } from 'components/leasing/interfaces/Result'
import {
  AssetType,
  emissionCategoryLimits,
  ScheduleRow,
} from 'components/leasing/types/LeasingTypes'
import helpers from 'src/logic/helpers'

export class LeasingCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
{
  public calculate(): this {
    const input = this.getInputData()

    const initialPaymentNet = helpers.round(
      (input.netAssetValue * input.initialPaymentRate) / 100,
      2,
    )
    const financedAmount = helpers.round(
      input.netAssetValue - initialPaymentNet,
      2,
    )
    const residualValueNet = helpers.round(
      (input.netAssetValue * input.residualValueRate) / 100,
      2,
    )

    const r = input.annualInterestRate / 100 / 12
    const n = input.installmentCount

    let pmt: number
    if (r === 0) {
      pmt = helpers.round((financedAmount - residualValueNet) / n, 2)
    } else {
      const discountedRv = residualValueNet / Math.pow(1 + r, n)
      pmt = helpers.round(
        ((financedAmount - discountedRv) * r) / (1 - Math.pow(1 + r, -n)),
        2,
      )
    }

    const schedule: ScheduleRow[] = []
    let balance = financedAmount
    let totalInterest = 0
    let totalCapital = 0

    for (let i = 1; i <= n; i++) {
      let interestPart: number
      let capitalPart: number
      let installmentNet: number

      if (i === n) {
        capitalPart = helpers.round(balance - residualValueNet, 2)
        interestPart = r === 0 ? 0 : helpers.round(balance * r, 2)
        installmentNet = helpers.round(capitalPart + interestPart, 2)
      } else {
        interestPart = r === 0 ? 0 : helpers.round(balance * r, 2)
        capitalPart = helpers.round(pmt - interestPart, 2)
        installmentNet = pmt
      }

      balance = helpers.round(balance - capitalPart, 2)
      totalInterest = helpers.round(totalInterest + interestPart, 2)
      totalCapital = helpers.round(totalCapital + capitalPart, 2)

      schedule.push({
        month: i,
        installmentNet,
        capitalPart,
        interestPart,
        remainingBalance: balance,
      })
    }

    const vatRate = input.vatRate
    const initialPaymentGross = helpers.round(
      initialPaymentNet * (1 + vatRate),
      2,
    )
    const monthlyInstallmentGross = helpers.round(pmt * (1 + vatRate), 2)
    const residualValueGross = helpers.round(
      residualValueNet * (1 + vatRate),
      2,
    )

    const totalInstallmentsNet = helpers.round(
      schedule.reduce((sum, row) => sum + row.installmentNet, 0),
      2,
    )
    const totalCostNet = helpers.round(
      initialPaymentNet + totalInstallmentsNet + residualValueNet,
      2,
    )

    const totalVatInstallments = helpers.round(
      totalInstallmentsNet * vatRate,
      2,
    )
    const totalVat = helpers.round(
      initialPaymentNet * vatRate +
        totalVatInstallments +
        residualValueNet * vatRate,
      2,
    )
    const totalCostGross = helpers.round(totalCostNet + totalVat, 2)

    const deductibleVat = helpers.round(totalVat * input.vatDeductionRate, 2)

    let kupProportion = 1
    if (input.assetType === AssetType.Car) {
      const limit = emissionCategoryLimits[input.emissionCategory]
      kupProportion = Math.min(1, helpers.round(limit / input.netAssetValue, 4))
    }

    const nonDeductibleVatRate = 1 - input.vatDeductionRate
    let totalKup: number

    if (input.assetType === AssetType.Car) {
      const kupFromCapital = helpers.round(totalCapital * kupProportion, 2)
      const kupFromInitialPayment = helpers.round(
        initialPaymentNet * kupProportion,
        2,
      )
      const kupFromInterest = totalInterest

      const nonDeductibleVatInstallments = helpers.round(
        totalInstallmentsNet * vatRate * nonDeductibleVatRate,
        2,
      )
      const nonDeductibleVatInitial = helpers.round(
        initialPaymentNet * vatRate * nonDeductibleVatRate,
        2,
      )
      const kupFromNonDeductibleVat = helpers.round(
        (nonDeductibleVatInstallments + nonDeductibleVatInitial) *
          kupProportion,
        2,
      )

      totalKup = helpers.round(
        kupFromCapital +
          kupFromInitialPayment +
          kupFromInterest +
          kupFromNonDeductibleVat,
        2,
      )
    } else {
      totalKup = helpers.round(
        totalCapital + initialPaymentNet + totalInterest,
        2,
      )
    }

    this.result = {
      monthlyInstallmentNet: pmt,
      monthlyInstallmentGross: monthlyInstallmentGross,
      initialPaymentNet,
      initialPaymentGross,
      financedAmount,
      residualValueNet,
      residualValueGross,
      totalCostNet,
      totalCostGross,
      totalInterest,
      totalVat,
      deductibleVat,
      kupProportion,
      totalKup,
      schedule,
    }

    return this
  }
}
