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
    const maxMonths = 120 // EDO bonds have a 10-year (120 month) maturity period
    
    let accumulatedInterest = 0
    let accumulatedProfit = 0
    let currentPrincipal = boughtBondAmount
    let yearlyInterest = 0
    let yearlyTaxAmount = 0
    
    const monthlyResults: MonthlyResult[] = []

    for(let i = 0; i < maxMonths; i++) {
      const currentYear = Math.floor(i / 12)
      const isLastMonthOfYear = (i + 1) % 12 === 0
      const isFirstMonthOfYear = i % 12 === 0
      
      // Determine the interest rate for this year
      // First year: fixed initial interest rate (e.g., 3.00%)
      // Subsequent years: Inflation rate + margin (e.g., 1.5%)
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
      
      // Reset yearly interest and tax at the beginning of each year
      if (isFirstMonthOfYear) {
        yearlyInterest = 0
        yearlyTaxAmount = 0
      }
      
      // Calculate monthly interest (pre-tax)
      // Interest is calculated monthly but capitalized annually
      const monthlyInterest = helpers.round(currentPrincipal * yearlyRate / 12, 2)
      yearlyInterest = helpers.round(yearlyInterest + monthlyInterest, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + monthlyInterest, 2)
      
      // Calculate tax if applicable
      let monthlyTaxAmount = 0
      if(this.getInputData().belkaTax) {
        monthlyTaxAmount = helpers.round(monthlyInterest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
        yearlyTaxAmount = helpers.round(yearlyTaxAmount + monthlyTaxAmount, 2)
      }
      
      // Calculate post-tax interest
      const monthlyInterestPostTax = helpers.round(monthlyInterest - monthlyTaxAmount, 2)
      accumulatedProfit = helpers.round(accumulatedProfit + monthlyInterestPostTax, 2)
      
      // Calculate inflation cost for real profit calculation
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      const realProfit = helpers.round(monthlyInterestPostTax - inflationCost, 2)
      const accumulatedRealProfit = helpers.round((i > 0 ? monthlyResults[i-1].accumulatedRealProfit : 0) + realProfit, 2)
      
      // Monthly payout (interest is capitalized annually, no monthly payout)
      let payout = 0
      
      // For the last month of each year, capitalize the interest
      if (isLastMonthOfYear && i < maxMonths - 1) {
        // Add yearly interest (minus tax) to principal (capitalization)
        const yearlyInterestPostTax = helpers.round(yearlyInterest - yearlyTaxAmount, 2)
        currentPrincipal = helpers.round(currentPrincipal + yearlyInterestPostTax, 2)
      }
      
      // For the last month, add principal to the payout
      if (i === maxMonths - 1) {
        payout = helpers.round(currentPrincipal + monthlyInterestPostTax, 2)
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: yearlyRate, // Store the yearly rate for clarity
        interest: monthlyInterest,
        accumulatedInterest: accumulatedInterest,
        accumulatedProfit: accumulatedProfit,
        taxAmount: monthlyTaxAmount,
        accumulatedTaxAmount: helpers.round(accumulatedInterest - accumulatedProfit, 2),
        accumulatedRealProfit: accumulatedRealProfit,
        payout: payout,
      }
      
      monthlyResults.push(monthlyResult)
    }
    
    this.result = {monthlyResults: monthlyResults}

    return this
  }
}
