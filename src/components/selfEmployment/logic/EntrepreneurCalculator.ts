import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'
import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {EntrepreneurZusContribution} from 'src/logic/zus/EntrepreneurZusContribution'
import {FlatTax} from 'src/logic/taxes/FlatTax'
import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {LumpSumTax, LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'
import helpers from 'src/logic/helpers'

export class EntrepreneurCalculator extends BasicCalculator<InputFields, EntrepreneurResult> implements Calculator<InputFields, EntrepreneurResult>{
  zus: EntrepreneurZusContribution
  protected isPartOfAnnualResult = false
  protected sumUpContributionBasis = 0
  protected sumUpIncome = 0
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
    let income = this.getInputData().revenue

    if(this.getInputData().taxSystem !== EntrepreneurTaxSystem.LumpSumTax) {
      income = helpers.round(this.getInputData().revenue - this.getInputData().expenses, 2)
    }

    const incomeOverTaxReliefLimit = new HasTaxReliefLimit().geIncomeOverTaxReliefLimit(income, this.sumUpIncome, this.getInputData().hasTaxRelief)

    const {
      contributionBasis,
      accidentContribution,
      disabilityContribution,
      pensionContribution,
      sickContribution,
      fpContribution,
      fsContribution,
    } = this.getZusContributions()

    const socialContributions = helpers.round(disabilityContribution + pensionContribution + sickContribution + accidentContribution, 2)

    let incomeReducedByContributions = helpers.round(income - socialContributions, 2)
    let incomeOverReliefLimitReducedByContributions = helpers.round(incomeOverTaxReliefLimit - socialContributions, 2)

    if(this.getInputData().taxSystem !== EntrepreneurTaxSystem.LumpSumTax) {
      incomeOverReliefLimitReducedByContributions = helpers.round(incomeOverReliefLimitReducedByContributions - fpContribution - fsContribution, 2)
      incomeReducedByContributions = helpers.round(incomeReducedByContributions - fpContribution - fsContribution, 2)
    }

    const healthContribution = this.zus.getHealthContribution(
      this.getInputData().previousMonthHealthContributionBasis,
      this.getInputData().taxSystem,
      this.getInputData().monthIndex,
      this.getInputData().yearlyIncome,
  )

    const deductibleHealthContribution= this.zus.getDeductibleHealthContribution(healthContribution, this.getInputData().taxSystem, this.sumUpDeductibleHealthContribution)

    const taxBasis = incomeOverTaxReliefLimit > 0 ? helpers.round(incomeOverReliefLimitReducedByContributions - deductibleHealthContribution) : 0
    let taxAmount:number

    switch (this.getInputData().taxSystem) {
      case EntrepreneurTaxSystem.GeneralRules:
        taxAmount = new GeneraLRule().getIncomeTax(taxBasis, this.sumUpTaxBasis, this.getInputData().partTaxReducingAmount)
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

    const netAmount = helpers.round(income - socialContributions - fpContribution - fsContribution - healthContribution - taxAmount, 2)

    this.sumUpIncome = helpers.round(this.sumUpIncome + income, 2)
    this.sumUpContributionBasis = helpers.round(this.sumUpContributionBasis + contributionBasis, 2)
    this.sumUpDeductibleHealthContribution = helpers.round(this.sumUpDeductibleHealthContribution + deductibleHealthContribution, 2)
    this.sumUpTaxBasis = helpers.round(this.sumUpTaxBasis + taxBasis)

    this.result = {
      revenue: this.getInputData().revenue,
      netAmount,
      expenses: this.getInputData().expenses,
      taxBasis,
      taxAmount,
      accidentContribution,
      healthContributionBasis: incomeReducedByContributions,
      healthContribution,
      sickContribution,
      pensionContribution,
      disabilityContribution,
      fpContribution,
      fsContribution,
    }

    if(!this.isPartOfAnnualResult) {
      this.sumUpIncome = 0
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
      contributionBasis = this.zus.getContributionBasis(this.getInputData().contributionBasis, this.sumUpContributionBasis)

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
