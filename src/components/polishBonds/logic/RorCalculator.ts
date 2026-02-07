import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {RorInputFields} from 'components/polishBonds/interfaces/RorInputFields'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class RorCalculator extends BasicCalculator<RorInputFields, Result> implements Calculator<RorInputFields, Result> {

  public calculate(): this {
    const constants = storeToRefs(useConstantsStore())
    const bondConstants = useBondConstants()

    const monthCount = 12
    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    
    let accumulatedInterest = 0
    let accumulatedBelkaTaxAmount = 0
    let accumulatedProfit = 0
    let accumulatedRealProfit = 0
    
    const monthlyResults: MonthlyResult[] = []

    for(let i = 0; i < monthCount; i++) {
      // Determine the interest rate for this month
      const monthlyRate = i === 0 
        ? this.getInputData().initialInterestRate 
        : this.getInputData().nbpReferenceRates[i - 1] + bondConstants.ror.nbpRateMargin
      
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      
      const interest = helpers.round(boughtBondAmount * monthlyRate / 12, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + interest, 2)
      
      let belkaTaxAmount = 0
      if(this.getInputData().belkaTax) {
        belkaTaxAmount = helpers.round(interest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
      }
      accumulatedBelkaTaxAmount = helpers.round(accumulatedBelkaTaxAmount + belkaTaxAmount, 2)
      
      const profit = helpers.round(interest - belkaTaxAmount, 2)
      accumulatedProfit = helpers.round(accumulatedProfit + profit, 2)
      
      const realProfit = helpers.round(profit - inflationCost, 2)
      accumulatedRealProfit = helpers.round(accumulatedRealProfit + realProfit, 2)
      
      let payout = profit
      if(i === monthCount - 1) {
        payout = helpers.round(boughtBondAmount + profit, 2)
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: monthlyRate,
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
