import {AnnualEntrepreneurCalculator} from 'components/selfEmployment/logic/AnnualEntrepreneurCalculator'
import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurInputFields} from 'components/accountingWithSpouse/interfaces/EntrepreneurInputFields'
import {EntrepreneurResult} from 'components/accountingWithSpouse/interfaces/EntrepreneurResult'
import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import helpers from 'src/logic/helpers'

export class EntrepreneurCalculator extends BasicCalculator<EntrepreneurInputFields, EntrepreneurResult> implements Calculator<EntrepreneurInputFields, EntrepreneurResult>{
  protected readonly incomeTax: TaxScale
  protected calculateSumUpAmounts = false
  constructor() {
    super()
    this.incomeTax = new TaxScale()
  }

  public calculate():this{
    const monthlyInputs:InputFields[] = []

    for(let i = 0; i < 12; i++) {
      monthlyInputs.push({
        taxSystem: EntrepreneurTaxSystem.TaxScale,
        revenue: this.getInputData().revenues[i],
        expenses: this.getInputData().expenses[i],
        contributionBasis: this.getInputData().contributionBasises[i],
        isSickContribution: this.getInputData().isSickContribution,
        accidentContributionRate: this.getInputData().accidentContributionRate,
        monthIndex: i,
        partTaxReducingAmount: 12,
        yearlyIncome: 0,
        hasTaxRelief: this.getInputData().hasTaxRelief,
        isFpContribution: this.getInputData().isFpContribution,
        hasEmploymentContract: this.getInputData().hasEmploymentContract,
        previousMonthHealthContributionBasis: this.getInputData().previousMonthHealthContributionBasis,
        businessIsRunning: true,
        lossFromPreviousMonth: 0,
      })
    }

    const annualResults = new AnnualEntrepreneurCalculator()
      .setInputData(monthlyInputs).calculate().getResult().annualResult

    const {
      pensionContribution,
      disabilityContribution,
      sickContribution,
      healthContribution,
      accidentContribution,
      fpContribution,
      fsContribution,
    } = annualResults

    const totalRevenue = this.getInputData().revenues.reduce((accumulator:number, grosAmount:number) => {
      return helpers.round(accumulator + grosAmount, 2)
    }, 0)

    const totalExpenses = this.getInputData().expenses.reduce((accumulator:number, expenses:number) => {
      return helpers.round(accumulator + expenses, 2)
    }, 0)

    // the sum of all ZUS contributions
    const zusContributions = helpers.round(disabilityContribution + pensionContribution + sickContribution + accidentContribution + fpContribution + fsContribution + healthContribution, 2)

    // all social contributions can be the expenses
    const expensesToReduceTaxBasis = helpers.round(totalExpenses + disabilityContribution + pensionContribution + sickContribution + accidentContribution + fpContribution + fsContribution, 2)

    const revenueOverTaxReliefLimit = this.incomeTax.geRevenueOverTaxReliefLimit(totalRevenue, 0, this.getInputData().hasTaxRelief)
    const taxBasis =  Math.max(helpers.round(revenueOverTaxReliefLimit - expensesToReduceTaxBasis, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis,0, 1)

    const income = helpers.round(totalRevenue - totalExpenses - zusContributions - taxAmount, 2)

    this.result = {
      revenue: totalRevenue,
      expenses: totalExpenses,
      healthContribution,
      sickContribution,
      pensionContribution,
      disabilityContribution,
      fsContribution,
      fpContribution,
      accidentContribution,
      totalZuSContributions: zusContributions,
      taxBasis,
      taxAmount,
      income,
    }

    return this
  }
}
