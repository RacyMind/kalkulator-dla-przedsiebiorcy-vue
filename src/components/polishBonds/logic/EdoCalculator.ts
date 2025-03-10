import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EdoInputFields} from 'components/polishBonds/interfaces/EdoInputFields'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class EdoCalculator extends BasicCalculator<EdoInputFields, Result> implements Calculator<EdoInputFields, Result> {

  public calculate(): this {
    const constants = useConstants()
    const bondConstants = useBondConstants()

    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    const maxMonths = 120 // EDO bonds have a 10-year maturity period
    
    let accumulatedInterest = 0
    let accumulatedProfit = 0
    let currentPrincipal = boughtBondAmount
    let yearlyInterest = 0
    
    const monthlyResults: MonthlyResult[] = []

    for(let i = 0; i < maxMonths; i++) {
      const currentYear = Math.floor(i / 12)
      const isLastMonthOfYear = (i + 1) % 12 === 0
      const isFirstMonthOfYear = i % 12 === 0
      const isLastMonth = i === maxMonths - 1
      
      // Determine the interest rate for this year
      let yearlyRate
      if (currentYear === 0) {
        yearlyRate = this.getInputData().initialInterestRate
      } else {
        yearlyRate = helpers.round(
          this.getInputData().yearlyInflationRate + 
          bondConstants.edo.inflationMargin, 
          4,
        )
      }
      
      // Reset yearly interest at the beginning of each year
      if (isFirstMonthOfYear) {
        yearlyInterest = 0
      }
      
      // Calculate monthly interest
      const monthlyInterest = helpers.round(currentPrincipal * yearlyRate / 12, 2)
      yearlyInterest = helpers.round(yearlyInterest + monthlyInterest, 2)
      
      // Update accumulated interest
      accumulatedInterest = helpers.round(accumulatedInterest + monthlyInterest, 2)
      
      // Calculate tax - only for the last month
      let monthlyTaxAmount = 0
      let accumulatedTaxAmount = 0
      
      if (isLastMonth && this.getInputData().belkaTax) {
        accumulatedTaxAmount = helpers.round(accumulatedInterest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
        monthlyTaxAmount = accumulatedTaxAmount
      }
      
      // Calculate profit
      const monthlyProfit = helpers.round(monthlyInterest - monthlyTaxAmount, 2)
      
      if (isLastMonth && this.getInputData().belkaTax) {
        accumulatedProfit = helpers.round(accumulatedInterest - accumulatedTaxAmount, 2)
      } else {
        accumulatedProfit = helpers.round(i === 0 ? monthlyProfit : accumulatedProfit + monthlyProfit, 2)
      }
      
      // Calculate inflation cost for real profit calculation
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      const realProfit = helpers.round(monthlyProfit - inflationCost, 2)
      
      // Calculate accumulated real profit
      let accumulatedRealProfit
      if (i === 0) {
        accumulatedRealProfit = realProfit
      } else if (isLastMonth) {
        const totalInflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate * maxMonths / 12, 2)
        accumulatedRealProfit = helpers.round(accumulatedProfit - totalInflationCost, 2)
      } else {
        accumulatedRealProfit = helpers.round(monthlyResults[i-1].accumulatedRealProfit + realProfit, 2)
      }
      
      // Monthly payout (interest is capitalized annually, no monthly payout)
      let payout = 0
      
      // For the last month of each year, capitalize the interest
      if (isLastMonthOfYear && i < maxMonths - 1) {
        currentPrincipal = helpers.round(currentPrincipal + yearlyInterest, 2)
      }
      
      // For the last month, add principal to the payout
      if (isLastMonth) {
        payout = helpers.round(boughtBondAmount + accumulatedProfit, 2)
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: yearlyRate,
        interest: monthlyInterest,
        accumulatedInterest: accumulatedInterest,
        accumulatedProfit: accumulatedProfit,
        taxAmount: monthlyTaxAmount,
        accumulatedTaxAmount: accumulatedTaxAmount,
        accumulatedRealProfit: accumulatedRealProfit,
        payout: payout,
      }
      
      monthlyResults.push(monthlyResult)
    }
    
    this.result = {monthlyResults: monthlyResults}

    return this
  }
}
