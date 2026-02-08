import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {OtsInputFields} from 'components/polishBonds/interfaces/OtsInputFields'
import {Result} from 'components/polishBonds/interfaces/Result'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class OtsCalculator extends BasicCalculator<OtsInputFields, Result> implements Calculator<OtsInputFields, Result> {

  public calculate(): this {
    const constants = storeToRefs(useConstantsStore())
    const bondConstants = useBondConstants()

    const monthCount = 3
    const interestRate = this.getInputData().interestRate
    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost


    let accumulatedInterest = 0
    let accumulatedBelkaTaxAmount = 0
    let accumulatedProfit = 0
    let accumulatedRealProfit = 0

    const monthlyResults: MonthlyResult[] = []

    for(let i = 0; i < monthCount; i++) {
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)

      const interest = helpers.round(boughtBondAmount * interestRate / 12, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + interest, 2)

      let belkaTaxAmount = 0
      if(this.getInputData().belkaTax) {
        belkaTaxAmount = helpers.round(interest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
      }
      accumulatedBelkaTaxAmount = helpers.round(belkaTaxAmount + accumulatedBelkaTaxAmount, 2)

      const profit = helpers.round(interest - belkaTaxAmount, 2)
      accumulatedProfit = helpers.round(accumulatedProfit + profit, 2)

      const realProfit = helpers.round(profit - inflationCost, 2)
      accumulatedRealProfit = helpers.round(accumulatedRealProfit + realProfit, 2)

      let payout = 0
      if(i === monthCount - 1) {
        payout = helpers.round(boughtBondAmount + accumulatedProfit, 2)
      }

      const monthlyResult:MonthlyResult = {
        interestRate: interestRate,
        interest: interest,
        accumulatedInterest: accumulatedInterest,
        accumulatedProfit: accumulatedProfit,
        taxAmount: belkaTaxAmount,
        accumulatedTaxAmount: accumulatedBelkaTaxAmount,
        accumulatedRealProfit: accumulatedRealProfit,
        payout: payout,
      }

      monthlyResults.push(monthlyResult)
    }
    
    this.result = {monthlyResults: monthlyResults}

    return this
  }
}
