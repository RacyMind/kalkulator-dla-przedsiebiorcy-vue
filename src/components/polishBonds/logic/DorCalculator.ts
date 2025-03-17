import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {DorInputFields} from 'components/polishBonds/interfaces/DorInputFields'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class DorCalculator extends BasicCalculator<DorInputFields, Result> implements Calculator<DorInputFields, Result> {

  public calculate(): this {
    const constants = useConstants()
    const bondConstants = useBondConstants()

    const monthCount = 24 // DOR bonds have a 2-year maturity period
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
        : helpers.round(this.getInputData().nbpReferenceRates[i - 1] + bondConstants.dor.nbpRateMargin, 4)
      
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
