import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {CoiInputFields} from 'components/polishBonds/interfaces/CoiInputFields'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class CoiCalculator extends BasicCalculator<CoiInputFields, Result> implements Calculator<CoiInputFields, Result> {

  public calculate(): this {
    const constants = useConstants()
    const bondConstants = useBondConstants()

    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    const maxMonths = 48 // COI bonds have a 4-year (48 month) maturity period
    
    let accumulatedInterest = 0
    let accumulatedProfit = 0
    let accumulatedTaxAmount = 0
    
    const monthlyResults: MonthlyResult[] = []
    
    // For COI bonds with annual interest rate adjustments
    const currentPrincipal = boughtBondAmount
    
    for(let i = 0; i < maxMonths; i++) {
      // Determine the interest rate based on the period
      // First year uses the initial interest rate from bond constants
      // Subsequent years use inflation rate + margin
      const interestRate = i < 12 
        ? bondConstants.coi.initialInterestRate 
        : helpers.round(this.getInputData().yearlyInflationRate + bondConstants.coi.inflationMargin, 4)
      
      // Calculate monthly interest based on the current principal
      const monthlyInterest = helpers.round(currentPrincipal * interestRate / 12, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + monthlyInterest, 2)
      
      // Calculate tax if applicable
      let monthlyTaxAmount = 0
      if(this.getInputData().belkaTax) {
        monthlyTaxAmount = helpers.round(monthlyInterest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
        accumulatedTaxAmount = helpers.round(accumulatedTaxAmount + monthlyTaxAmount, 2)
      }
      
      // Calculate post-tax interest
      const monthlyInterestPostTax = helpers.round(monthlyInterest - monthlyTaxAmount, 2)
      accumulatedProfit = helpers.round(accumulatedProfit + monthlyInterestPostTax, 2)
      
      // Calculate inflation cost for real profit calculation
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      const realProfit = helpers.round(monthlyInterestPostTax - inflationCost, 2)
      const accumulatedRealProfit = helpers.round((i > 0 ? monthlyResults[i-1].accumulatedRealProfit : 0) + realProfit, 2)
      
      // For COI bonds, interest is paid at the end of each year
      let payout = 0
      
      // At the end of each year, pay out the interest
      // This happens at months 12, 24, 36, and 48 (1-indexed), which are indices 11, 23, 35, and 47 (0-indexed)
      if ((i + 1) % 12 === 0) {
        // For the last month (month 48), add principal to the payout
        if (i === maxMonths - 1) {
          // At maturity, pay out the principal plus the last year's interest
          if(this.getInputData().belkaTax) {
            // With Belka tax
            payout = helpers.round(boughtBondAmount + accumulatedInterest - (i > 11 ? monthlyResults[i-12].accumulatedInterest : 0), 2)
            payout = helpers.round(payout - accumulatedTaxAmount + (i > 11 ? monthlyResults[i-12].accumulatedTaxAmount : 0), 2)
          } else {
            // Without Belka tax
            payout = helpers.round(boughtBondAmount + accumulatedInterest - (i > 11 ? monthlyResults[i-12].accumulatedInterest : 0), 2)
          }
        } else {
          // For yearly payouts (months 12, 24, 36), pay out the accumulated interest for the year
          if(this.getInputData().belkaTax) {
            // With Belka tax
            const yearlyInterest = helpers.round(accumulatedInterest - (i > 11 ? monthlyResults[i-12].accumulatedInterest : 0), 2)
            const yearlyTax = helpers.round(accumulatedTaxAmount - (i > 11 ? monthlyResults[i-12].accumulatedTaxAmount : 0), 2)
            payout = helpers.round(yearlyInterest - yearlyTax, 2)
          } else {
            // Without Belka tax
            payout = helpers.round(accumulatedInterest - (i > 11 ? monthlyResults[i-12].accumulatedInterest : 0), 2)
          }
        }
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: interestRate,
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
