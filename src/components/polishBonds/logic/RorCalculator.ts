import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {MonthlyResult} from 'components/polishBonds/interfaces/MonthlyResult'
import {Result} from 'components/polishBonds/interfaces/Result'
import {RorInputFields} from 'components/polishBonds/interfaces/RorInputFields'
import {useBondConstants} from 'components/polishBonds/logic/BondConstants'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class RorCalculator extends BasicCalculator<RorInputFields, Result> implements Calculator<RorInputFields, Result> {

  public calculate(): this {
    const constants = useConstants()
    const bondConstants = useBondConstants()

    const boughtBondAmount =  this.getInputData().boughtBondCount * bondConstants.bondCost
    const maxMonths = 12
    
    let accumulatedInterest = 0
    let accumulatedProfit = 0
    
    const monthlyResults: MonthlyResult[] = []

    for(let i = 0; i < maxMonths; i++) {
      // Determine the interest rate for this month
      // First month: fixed initial interest rate (e.g., 5.75%)
      // Subsequent months: NBP reference rate + margin (0.00%)
      const monthlyRate = i === 0 
        ? this.getInputData().initialInterestRate 
        : this.getInputData().nbpReferenceRates[i - 1] + bondConstants.ror.nbpRateMargin
      
      // Calculate monthly interest (pre-tax) - no capitalization, always based on initial principal
      const monthlyInterest = helpers.round(boughtBondAmount * monthlyRate / 12, 2)
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
      
      // Monthly payout (interest is paid monthly)
      let payout = monthlyInterestPostTax
      
      // For the last month, add principal to the payout
      if (i === maxMonths - 1) {
        payout = helpers.round(boughtBondAmount + monthlyInterestPostTax, 2)
      }
      
      const monthlyResult: MonthlyResult = {
        interestRate: monthlyRate,
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
