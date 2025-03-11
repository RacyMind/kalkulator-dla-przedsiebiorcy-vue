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

    const monthCount = 48 // COI bonds have a 4-year maturity period
    const boughtBondAmount = this.getInputData().boughtBondCount * bondConstants.bondCost
    
    let accumulatedInterest = 0
    let accumulatedBelkaTaxAmount = 0
    let accumulatedProfit = 0
    let accumulatedRealProfit = 0
    
    const monthlyResults: MonthlyResult[] = []
    
    const currentPrincipal = boughtBondAmount
    
    for(let i = 0; i < monthCount; i++) {
      // Determine the interest rate based on the period
      const interestRate = i < 12 
        ? bondConstants.coi.initialInterestRate 
        : helpers.round(Math.max(0, this.getInputData().yearlyInflationRate) + bondConstants.coi.inflationMargin, 4)
      
      const inflationCost = helpers.round(boughtBondAmount * this.getInputData().yearlyInflationRate / 12, 2)
      
      const interest = helpers.round(currentPrincipal * interestRate / 12, 2)
      accumulatedInterest = helpers.round(accumulatedInterest + interest, 2)
      
      let belkaTaxAmount = 0
      if(this.getInputData().belkaTax) {
        belkaTaxAmount = helpers.round(interest * constants.incomeTaxConstants.value.belkaTaxRate, 2)
        accumulatedBelkaTaxAmount = helpers.round(accumulatedBelkaTaxAmount + belkaTaxAmount, 2)
      }
      
      const profit = helpers.round(interest - belkaTaxAmount, 2)
      accumulatedProfit = helpers.round(accumulatedProfit + profit, 2)
      
      const realProfit = helpers.round(profit - inflationCost, 2)
      accumulatedRealProfit = helpers.round(accumulatedRealProfit + realProfit, 2)
      
      // For COI bonds, interest is paid at the end of each year
      let payout = 0
      
      const isEndOfYear = (i + 1) % 12 === 0
      if (isEndOfYear) {
        payout = this.calculatePayout(i, monthlyResults, boughtBondAmount, accumulatedInterest, accumulatedBelkaTaxAmount)
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

  private calculatePayout(
    currentMonth: number, 
    monthlyResults: MonthlyResult[], 
    boughtBondAmount: number, 
    accumulatedInterest: number, 
    accumulatedBelkaTaxAmount: number,
  ): number {
    const monthCount = 48
    const isFinalMonth = currentMonth === monthCount - 1
    const hasPreviousYearData = currentMonth > 11
    
    // Get interest accumulated at the end of previous year (if available)
    const previousYearInterest = hasPreviousYearData ? monthlyResults[currentMonth-12].accumulatedInterest : 0
    const previousYearTax = hasPreviousYearData ? monthlyResults[currentMonth-12].accumulatedTaxAmount : 0
    
    // Calculate interest earned in current year
    const currentYearInterest = helpers.round(accumulatedInterest - previousYearInterest, 2)
    const currentYearTax = helpers.round(accumulatedBelkaTaxAmount - previousYearTax, 2)
    
    // Case 1: Final month with Belka tax
    if (isFinalMonth && this.getInputData().belkaTax) {
      const principalPlusInterest = helpers.round(boughtBondAmount + currentYearInterest, 2)
      return helpers.round(principalPlusInterest - currentYearTax, 2)
    }
    
    // Case 2: Final month without Belka tax
    if (isFinalMonth) {
      return helpers.round(boughtBondAmount + currentYearInterest, 2)
    }
    
    // Case 3: Yearly payout with Belka tax
    if (this.getInputData().belkaTax) {
      return helpers.round(currentYearInterest - currentYearTax, 2)
    }
    
    // Case 4: Yearly payout without Belka tax
    return currentYearInterest
  }
}
