import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'
import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {EntrepreneurZusContribution} from 'src/logic/zus/EntrepreneurZusContribution'
import {FlatTax} from 'src/logic/taxes/FlatTax'
import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {LumpSumTax, LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import helpers from 'src/logic/helpers'

export class EntrepreneurCalculator extends BasicCalculator<InputFields, EntrepreneurResult> implements Calculator<InputFields, EntrepreneurResult>{
  zus: EntrepreneurZusContribution
  protected isPartOfAnnualResult = false
  protected sumUpContributionBasis = 0
  protected sumUpRevenue = 0
  protected sumUpTaxBasis = 0
  protected sumUpDeductibleHealthContribution = 0

  /**
   * @param isPartOfAnnualResult if isPartOfAnnualResult is true, it saves important values for next month calculations
   */
  constructor(isPartOfAnnualResult = false) {
    super()
    this.isPartOfAnnualResult = isPartOfAnnualResult
    this.zus = new EntrepreneurZusContribution()
  }

  public calculate(): this {
    let expensesToReduceTaxBasis = 0
    const revenueOverTaxReliefLimit = new HasTaxReliefLimit().geRevenueOverTaxReliefLimit(this.getInputData().revenue, this.sumUpRevenue, this.getInputData().hasTaxRelief)

    if(this.getInputData().taxSystem !== EntrepreneurTaxSystem.LumpSumTax) {
      // for the lump sum tax, the expenses can't reduce the tax basis
      expensesToReduceTaxBasis = this.getInputData().expenses
    }

    const {
      contributionBasis,
      accidentContribution,
      disabilityContribution,
      pensionContribution,
      sickContribution,
      fpContribution,
      fsContribution,
    } = this.getZusContributions()

    // all social contributions can be the expenses
    expensesToReduceTaxBasis = helpers.round(expensesToReduceTaxBasis + disabilityContribution + pensionContribution + sickContribution + accidentContribution, 2)

    if(this.getInputData().taxSystem !== EntrepreneurTaxSystem.LumpSumTax) {
      // for the lump sum tax, FP contributions can't be the expenses
      expensesToReduceTaxBasis = helpers.round(expensesToReduceTaxBasis + fpContribution + fsContribution, 2)
    }

    const healthContributionBasis = helpers.round(this.getInputData().revenue - expensesToReduceTaxBasis, 2)

    if(healthContributionBasis < 0) {
      healthContributionBasis
    }

    const healthContribution = this.getInputData().businessIsRuning ? this.zus.getHealthContribution(
      this.getInputData().previousMonthHealthContributionBasis,
      this.getInputData().taxSystem,
      this.getInputData().monthIndex,
      this.getInputData().yearlyIncome,
    ) : 0

    // the sum of all ZUS contributions
    const zusContributions = helpers.round(disabilityContribution + pensionContribution + sickContribution + accidentContribution + fpContribution + fsContribution + healthContribution, 2)

    const deductibleHealthContribution= this.zus.getDeductibleHealthContribution(healthContribution, this.getInputData().taxSystem, this.sumUpDeductibleHealthContribution)
    expensesToReduceTaxBasis = helpers.round(expensesToReduceTaxBasis + deductibleHealthContribution, 2)

    // tax basis can't be negative if the tax relief is active, and the revenue is not over the limit
    let taxBasis = revenueOverTaxReliefLimit <= 0 && this.getInputData().hasTaxRelief ? 0 : helpers.round(revenueOverTaxReliefLimit - expensesToReduceTaxBasis)
    const deductibleExpenses = this.getInputData().taxSystem !== EntrepreneurTaxSystem.LumpSumTax && taxBasis < 0 ? Math.abs(taxBasis) : 0
    taxBasis = taxBasis < 0 ? 0 : taxBasis

    let taxAmount:number

    switch (this.getInputData().taxSystem) {
      case EntrepreneurTaxSystem.TaxScale:
        taxAmount = new TaxScale().getIncomeTax(taxBasis, this.sumUpTaxBasis, this.getInputData().partTaxReducingAmount)
        break
      case EntrepreneurTaxSystem.FlatTax:
        taxAmount = new FlatTax().getIncomeTax(taxBasis)
        break
      case EntrepreneurTaxSystem.LumpSumTax:
        if( typeof this.getInputData().lumpSumTaxRate === undefined) {
          throw Error('The unknown lump sum tax rate')
        }

        taxAmount = new LumpSumTax().getIncomeTax(taxBasis, <LumpSumTaxRate>this.getInputData().lumpSumTaxRate)
        break
    }

    const income = helpers.round(this.getInputData().revenue - this.getInputData().expenses - zusContributions - taxAmount, 2)

    this.sumUpRevenue = helpers.round(this.sumUpRevenue + this.getInputData().revenue, 2)
    this.sumUpContributionBasis = helpers.round(this.sumUpContributionBasis + contributionBasis, 2)
    this.sumUpDeductibleHealthContribution = helpers.round(this.sumUpDeductibleHealthContribution + deductibleHealthContribution, 2)
    this.sumUpTaxBasis = helpers.round(this.sumUpTaxBasis + taxBasis)

    this.result = {
      revenue: this.getInputData().revenue,
      expenses: this.getInputData().expenses,
      income,
      taxBasis,
      deductibleExpenses,
      taxAmount,
      accidentContribution,
      healthContributionBasis,
      healthContribution,
      sickContribution,
      pensionContribution,
      disabilityContribution,
      fpContribution,
      fsContribution,
    }

    if(!this.isPartOfAnnualResult) {
      this.sumUpRevenue = 0
      this.sumUpTaxBasis = 0
      this.sumUpContributionBasis = 0
      this.sumUpDeductibleHealthContribution = 0
    }

    return this
  }

  protected getZusContributions() {
    let contributionBasis = 0
    let accidentContribution = 0
    let pensionContribution = 0
    let disabilityContribution = 0
    let sickContribution = 0
    let fpContribution = 0
    let fsContribution = 0

    if(!this.getInputData().hasEmploymentContract) {
      contributionBasis = this.zus.getContributionBasisWithinLimit(this.getInputData().contributionBasis, this.sumUpContributionBasis)

      pensionContribution = this.zus.gePensionContribution(contributionBasis)
      disabilityContribution = this.zus.geDisabilityContribution(contributionBasis)

      if(this.getInputData().isSickContribution) {
        sickContribution = this.zus.getSickContribution(this.getInputData().contributionBasis)
      }
      if(this.getInputData().isFpContribution) {
        fpContribution = this.zus.getFPContribution(this.getInputData().contributionBasis)
        fsContribution = this.zus.getFSContribution(this.getInputData().contributionBasis)
      }
      if (this.getInputData().accidentContributionRate) {
        accidentContribution = this.zus.getAccidentContribution(this.getInputData().contributionBasis, this.getInputData().accidentContributionRate)
      }
    }

    return {
      contributionBasis,
      accidentContribution,
      pensionContribution,
      disabilityContribution,
      sickContribution,
      fpContribution,
      fsContribution,
    }
  }

}
