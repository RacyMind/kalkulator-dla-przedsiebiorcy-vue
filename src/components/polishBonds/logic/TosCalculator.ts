import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {TosInputFields} from 'components/polishBonds/interfaces/TosInputFields'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class TosCalculator extends BasicCalculator<TosInputFields, Result> implements Calculator<TosInputFields, Result> {

  public calculate(): this {
    const constants = storeToRefs(useConstantsStore())
    const bondConstants = useBondConstants()

    const monthCount = 36 // TOS bonds have a 3-year maturity period
    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    const interestRate = this.getInputData().interestRate
    
    let accumulatedInterest = 0
    let accumulatedBelkaTaxAmount = 0
    let accumulatedProfit = 0
    let accumulatedRealProfit = 0
    
    const monthlyResults: MonthlyResult[] = []

    // For TOS bonds with annual capitalization, we need to track the principal with capitalized interest
    let currentPrincipal = boughtBondAmount
    
    for(let i = 0; i < monthCount; i++) {
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      
      const interest = helpers.round(currentPrincipal * interestRate / 12, 2)
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
      
      // For TOS bonds, interest is paid at maturity
      let payout = 0
      
      const isEndOfYear = (i + 1) % 12 === 0
      const isNotFinalYear = i < monthCount - 1
      if (isEndOfYear && isNotFinalYear) {
        const yearlyInterest = helpers.round(currentPrincipal * interestRate, 2)
        currentPrincipal = helpers.round(currentPrincipal + yearlyInterest, 2)
      }
      
      // For the last month, add principal to the payout
      if (i === monthCount - 1) {
        payout = helpers.round(boughtBondAmount + accumulatedProfit, 2)
      }
      
      const monthlyResult: MonthlyResult = {
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
