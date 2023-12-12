import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {EntrepreneurZusContribution} from 'src/logic/zus/EntrepreneurZusContribution'
import {FlatTax} from 'src/logic/taxes/FlatTax'
import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {LumpSumTax} from 'src/logic/taxes/LumpSumTax'
import helpers from 'src/logic/helpers'

export class EntrepreneurCalculator extends BasicCalculator<InputFields, EntrepreneurCalculator> implements Calculator<InputFields, EntrepreneurCalculator>{
  zus: EntrepreneurZusContribution
  protected isPartOfAnnualResult = false
  protected sumUpContributionBasis = 0
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

    const {
      contributionBasis,
      accidentContribution,
      disabilityContribution,
      pensionContribution,
      sickContribution,
      fpContribution,
      fgspContribution,
      fsContribution,
    } = this.getZusContributions()

    let incomeReducedByZUsContributions = helpers.round(income - disabilityContribution - pensionContribution - sickContribution - accidentContribution, 2)

    if(this.getInputData().taxSystem !== EntrepreneurTaxSystem.LumpSumTax) {
      incomeReducedByZUsContributions = helpers.round(incomeReducedByZUsContributions - fpContribution - fgspContribution - fsContribution, 2)
    }

    const healthContribution = this.zus.getHealthContribution(
      this.getInputData().lastMonthHealthContributionBasis,
      this.getInputData().taxSystem,
      this.getInputData().monthIndex,
      this.getInputData().yearlyIncome,
  )

    const deductibleHealthContribution= this.zus.getDeductibleHealthContribution(healthContribution, this.getInputData().taxSystem, this.sumUpDeductibleHealthContribution)

    const taxBasis = helpers.round(incomeReducedByZUsContributions - deductibleHealthContribution)
    let taxAmount:number

    switch (this.getInputData().taxSystem) {
      case EntrepreneurTaxSystem.GeneralRules:
        taxAmount = new GeneraLRule().getIncomeTax(taxBasis, this.sumUpTaxBasis, this.getInputData().partTaxReducingAmount)
        break
      case EntrepreneurTaxSystem.FlatTax:
        taxAmount = new FlatTax().getIncomeTax(taxBasis)
        break
      case EntrepreneurTaxSystem.LumpSumTax:
        taxAmount = new LumpSumTax().getIncomeTax(taxBasis, this.getInputData().lumpSumTaxRate)
        break
    }

    this.sumUpContributionBasis = helpers.round(this.sumUpContributionBasis + contributionBasis, 2)
    this.sumUpDeductibleHealthContribution = helpers.round(this.sumUpDeductibleHealthContribution + deductibleHealthContribution, 2)
    this.sumUpTaxBasis = helpers.round(this.sumUpTaxBasis + taxBasis)

    if(!this.isPartOfAnnualResult) {
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
    let fgspContribution = 0
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
        fgspContribution = this.zus.getFGSPContribution(this.getInputData().contributionBasis)
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
      fgspContribution,
      fsContribution,
    }
  }

}
