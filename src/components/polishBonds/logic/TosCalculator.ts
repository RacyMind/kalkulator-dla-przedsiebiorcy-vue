import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {TosInputFields} from 'components/polishBonds/interfaces/TosInputFields'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class TosCalculator extends BasicCalculator<TosInputFields, Result> implements Calculator<TosInputFields, Result> {

  public calculate(): this {
    const constants = useConstants()
    const bondConstants = useBondConstants()

    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    const maxMonths = 36 // TOS bonds have a 3-year (36 month) maturity period
    
    let accumulatedInterest = 0
    let accumulatedProfit = 0
    
    const monthlyResults: MonthlyResult[] = []

    // For TOS bonds with annual capitalization, we need to track the principal with capitalized interest
    let currentPrincipal = boughtBondAmount
    
    for(let i = 0; i < maxMonths; i++) {
      // TOS bonds have fixed interest rate for the entire period
      const interestRate = this.getInputData().interestRate
      
      // Calculate monthly interest based on the current principal
      // For TOS bonds, interest is calculated monthly but capitalized annually
      const monthlyInterest = helpers.round(currentPrincipal * interestRate / 12, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + monthlyInterest, 2)
      
      // Calculate tax if applicable
      let monthlyTaxAmount = 0
      if(this.getInputData().belkaTax) {
        monthlyTaxAmount = helpers.round(monthlyInterest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
      }
      
      // Calculate post-tax interest
      const monthlyInterestPostTax = helpers.round(monthlyInterest - monthlyTaxAmount, 2)
      accumulatedProfit = helpers.round(accumulatedProfit + monthlyInterestPostTax, 2)
      
      // Calculate inflation cost for real profit calculation
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      const realProfit = helpers.round(monthlyInterestPostTax - inflationCost, 2)
      const accumulatedRealProfit = helpers.round((i > 0 ? monthlyResults[i-1].accumulatedRealProfit : 0) + realProfit, 2)
      
      // For TOS bonds, interest is paid at maturity, so monthly payout is 0
      // except for the last month where principal + all interest is paid
      let payout = 0
      
      // At the end of each year, capitalize the interest (add to principal)
      // This happens at months 12 and 24 (1-indexed), which are indices 11 and 23 (0-indexed)
      if ((i + 1) % 12 === 0 && i < maxMonths - 1) {
        // Calculate the interest for the year
        const yearlyInterest = helpers.round(currentPrincipal * interestRate, 2)
        // Add the yearly interest to the principal for the next year
        currentPrincipal = helpers.round(currentPrincipal + yearlyInterest, 2)
      }
      
      // For the last month, add principal to the payout
      if (i === maxMonths - 1) {
        payout = helpers.round(boughtBondAmount + accumulatedProfit, 2)
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: interestRate,
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
