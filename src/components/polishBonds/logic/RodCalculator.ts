import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {RodInputFields} from 'components/polishBonds/interfaces/RodInputFields'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class RodCalculator extends BasicCalculator<RodInputFields, Result> implements Calculator<RodInputFields, Result> {

  public calculate(): this {
    const constants = useConstants()
    const bondConstants = useBondConstants()

    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    const maxMonths = 144 // ROD bonds have a 12-year maturity period
    
    let accumulatedInterest = 0
    let accumulatedBelkaTaxAmount = 0
    let accumulatedProfit = 0
    let accumulatedRealProfit = 0
    let currentPrincipal = boughtBondAmount
    let yearlyInterest = 0
    
    const monthlyResults: MonthlyResult[] = []

    for(let i = 0; i < maxMonths; i++) {
      const currentYear = Math.floor(i / 12)
      const isLastMonthOfYear = (i + 1) % 12 === 0
      const isFirstMonthOfYear = i % 12 === 0
      const isLastMonth = i === maxMonths - 1
      
      let yearlyRate
      if (currentYear === 0) {
        yearlyRate = this.getInputData().initialInterestRate
      } else {
        const inflationRate = Math.max(0, this.getInputData().yearlyInflationRate)
        yearlyRate = helpers.round(
          inflationRate + 
          bondConstants.rod.inflationMargin, 
          4,
        )
      }
      
      if (isFirstMonthOfYear) {
        yearlyInterest = 0
      }
      
      const interest = helpers.round(currentPrincipal * yearlyRate / 12, 2)
      yearlyInterest = helpers.round(yearlyInterest + interest, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + interest, 2)
      
      let belkaTaxAmount = 0
      if (isLastMonth && this.getInputData().belkaTax) {
        accumulatedBelkaTaxAmount = helpers.round(accumulatedInterest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
        belkaTaxAmount = accumulatedBelkaTaxAmount
      }
      
      const profit = helpers.round(interest - belkaTaxAmount, 2)
      
      if (isLastMonth && this.getInputData().belkaTax) {
        accumulatedProfit = helpers.round(accumulatedInterest - accumulatedBelkaTaxAmount, 2)
      } else {
        accumulatedProfit = helpers.round(i === 0 ? profit : accumulatedProfit + profit, 2)
      }
      
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      const realProfit = helpers.round(profit - inflationCost, 2)
      
      if (i === 0) {
        accumulatedRealProfit = realProfit
      } else if (isLastMonth) {
        const totalInflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate * maxMonths / 12, 2)
        accumulatedRealProfit = helpers.round(accumulatedProfit - totalInflationCost, 2)
      } else {
        accumulatedRealProfit = helpers.round(monthlyResults[i-1].accumulatedRealProfit + realProfit, 2)
      }
      
      let payout = 0
      
      if (isLastMonthOfYear && i < maxMonths - 1) {
        currentPrincipal = helpers.round(currentPrincipal + yearlyInterest, 2)
      }
      
      if (isLastMonth) {
        payout = helpers.round(boughtBondAmount + accumulatedProfit, 2)
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: yearlyRate,
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
