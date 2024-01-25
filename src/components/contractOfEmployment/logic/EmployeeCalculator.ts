import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import {SumUpAmounts} from 'components/contractOfEmployment/interfaces/SumUpAmounts'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class EmployeeCalculator extends BasicCalculator<InputFields, EmployeeResult> implements Calculator<InputFields, EmployeeResult>{
  protected readonly employeeZus: EmployeeZusContribution
  protected readonly incomeTax: TaxScale
  protected calculateSumUpAmounts = false
  protected sumUpContributionBasis = 0
  protected sumUpTaxBasis = 0
  protected sumUpAuthorExpenses = 0
  protected sumUpGrossAmount = 0

  /**
   * @param calculateSumUpAmounts if calculateSumUpAmounts is true, it saves important values for next month calculations
   */
  constructor(calculateSumUpAmounts = false) {
    super()
    this.calculateSumUpAmounts = calculateSumUpAmounts
    this.employeeZus = new EmployeeZusContribution()
    this.incomeTax = new TaxScale()
  }

  protected getExpenses(basisForExpenses:number):number {
    const { incomeTaxConstants } = useConstants()
    let expenses = 0

    if(this.getInputData().grossAmount <= 0) {
      return 0
    }

    if(this.getInputData().partOfWorkWithAuthorExpenses < 1) {
      expenses = this.getInputData().workInLivePlace ? incomeTaxConstants.value.taxScale.expenses.amounts.workInLivingPlace : incomeTaxConstants.value.taxScale.expenses.amounts.workOutsideLivingPlace
    }

    const authorExpenses = this.incomeTax.getAuthorExpenses(basisForExpenses, this.getInputData().partOfWorkWithAuthorExpenses, this.getInputData().hasTaxRelief, this.sumUpAuthorExpenses)
    this.sumUpAuthorExpenses = helpers.round(this.sumUpAuthorExpenses + authorExpenses, 2)

    return expenses + authorExpenses
  }

  public calculate():this{
    let employerPpkContribution = 0

    const contributionBasis = this.employeeZus.getContributionBasisWithinLimit(this.getInputData().grossAmount, this.sumUpContributionBasis)

    const {
      pensionContribution,
      disabilityContribution,
      sickContribution,
      ppkContribution,
      healthContribution,
      socialContributions,
    } = this.employeeZus.getZusContributions(
      this.getInputData().grossAmount,
      contributionBasis,
      this.getInputData().isPensionContribution,
      this.getInputData().isDisabilityContribution,
      this.getInputData().isSickContribution,
      this.getInputData().isHealthContribution,
      this.getInputData().employeePpkContributionRate,
    )

    if (this.getInputData().employerPpkContributionRate) {
      const employerZUs = new EmployerZusContribution()
      employerPpkContribution = employerZUs.getPPKContribution(this.getInputData().grossAmount, this.getInputData().employerPpkContributionRate)
    }

    const salaryAmountOverTaxReliefLimit = this.incomeTax.geRevenueOverTaxReliefLimit(this.getInputData().grossAmount + employerPpkContribution, this.sumUpGrossAmount, this.getInputData().hasTaxRelief)
    const expenses = this.getExpenses(salaryAmountOverTaxReliefLimit - socialContributions)
    const taxBasis =  Math.max(helpers.round(salaryAmountOverTaxReliefLimit - socialContributions - expenses, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis, this.sumUpTaxBasis, this.getInputData().partTaxReducingAmount)
    const netAmount = helpers.round(this.getInputData().grossAmount - socialContributions - healthContribution - ppkContribution - taxAmount, 2)

    this.sumUpContributionBasis = helpers.round(this.sumUpContributionBasis + contributionBasis, 2)
    this.sumUpTaxBasis = helpers.round(this.sumUpTaxBasis + taxBasis, 0)
    this.sumUpGrossAmount = helpers.round(this.sumUpGrossAmount + this.getInputData().grossAmount, 2)

    this.result = {
      grossAmount: this.getInputData().grossAmount,
      ppkIncomeFromEmployer: employerPpkContribution,
      healthContribution,
      sickContribution,
      ppkContribution,
      pensionContribution,
      disabilityContribution,
      expenses,
      taxBasis,
      taxAmount,
      netAmount,
    }

    if(!this.calculateSumUpAmounts) {
      this.sumUpTaxBasis = 0
      this.sumUpContributionBasis = 0
      this.sumUpAuthorExpenses = 0
      this.sumUpGrossAmount = 0
    }

    return this
  }

  public setSumUpAmounts(sumUpAmounts:SumUpAmounts):this {
    this.sumUpTaxBasis = sumUpAmounts.sumUpTaxBasis
    this.sumUpContributionBasis = sumUpAmounts.sumUpContributionBasis
    this.sumUpAuthorExpenses = sumUpAmounts.sumUpAuthorExpenses
    this.sumUpGrossAmount = sumUpAmounts.sumUpGrossAmount

    return this
  }

  public getSumUpAmounts():SumUpAmounts {
    return {
      sumUpTaxBasis: this.sumUpTaxBasis,
      sumUpContributionBasis: this.sumUpContributionBasis,
      sumUpAuthorExpenses: this.sumUpAuthorExpenses,
      sumUpGrossAmount: this.sumUpGrossAmount,
    }
  }
}
