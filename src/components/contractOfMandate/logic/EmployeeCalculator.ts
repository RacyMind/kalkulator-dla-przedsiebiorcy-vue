import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import {SumUpAmounts} from 'components/contractOfMandate/interfaces/SumUpAmounts'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class EmployeeCalculator extends BasicCalculator<InputFields, EmployeeResult> implements Calculator<InputFields, EmployeeResult>{
  protected readonly incomeTaxConstants
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
    const { incomeTaxConstants} = useConstants()

    this.incomeTaxConstants = incomeTaxConstants
    this.calculateSumUpAmounts = calculateSumUpAmounts
    this.employeeZus = new EmployeeZusContribution()
    this.incomeTax = new TaxScale()
  }

  protected getExpenses(basisForExpenses:number):number {
    const expenseRate = this.getInputData().canLumpSumTaxBe && this.getInputData().grossAmount <= this.incomeTaxConstants.value.taxScale.expenses.withoutExpensesUpTo ? 0 : this.incomeTaxConstants.value.taxScale.expenses.rates.default

    const partOfWorkWithoutAuthorExpenses = 1 - this.getInputData().partOfWorkWithAuthorExpenses

    const expenses = helpers.round(basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate, 2)

    const authorExpenses = this.incomeTax.getAuthorExpenses(basisForExpenses, this.getInputData().partOfWorkWithAuthorExpenses, this.getInputData().hasTaxRelief, this.sumUpAuthorExpenses)
    this.sumUpAuthorExpenses = helpers.round(this.sumUpAuthorExpenses + authorExpenses, 2)

    return expenses + authorExpenses
  }

  public calculate():this{
    let pensionContribution = 0
    let disabilityContribution = 0
    let sickContribution = 0
    let healthContribution = 0
    let ppkContribution = 0
    let employerPpkpkContribution = 0

    const contributionBasis = this.employeeZus.getContributionBasisWithinLimit(this.getInputData().grossAmount, this.sumUpContributionBasis)

    if (this.getInputData().isPensionContribution) {
      pensionContribution = this.employeeZus.gePensionContribution(contributionBasis)
    }
    if (this.getInputData().isDisabilityContribution) {
      disabilityContribution = this.employeeZus.geDisabilityContribution(contributionBasis)
    }
    if (this.getInputData().isSickContribution) {
      sickContribution = this.employeeZus.getSickContribution(this.getInputData().grossAmount)
    }
    if (this.getInputData().employeePpkContributionRate) {
      ppkContribution = this.employeeZus.getPPKContribution(this.getInputData().grossAmount, this.getInputData().employeePpkContributionRate)
    }
    if (this.getInputData().employerPpkContributionRate) {
      const employerZUs = new EmployerZusContribution()
      employerPpkpkContribution = employerZUs.getPPKContribution(this.getInputData().grossAmount, this.getInputData().employerPpkContributionRate)
    }

    // these contributions reduce the basis for tax
    const socialContributions = helpers.round(pensionContribution + disabilityContribution + sickContribution, 2)

    if(this.getInputData().isHealthContribution) {
      healthContribution = this.employeeZus.getHealthContribution(this.getInputData().grossAmount - socialContributions)
    }

    const salaryAmountOverTaxReliefLimit = this.incomeTax.geRevenueOverTaxReliefLimit(this.getInputData().grossAmount + employerPpkpkContribution, this.sumUpGrossAmount, this.getInputData().hasTaxRelief)
    const expenses = this.getExpenses(salaryAmountOverTaxReliefLimit - socialContributions)
    const taxBasis =  Math.max(helpers.round(salaryAmountOverTaxReliefLimit - socialContributions - expenses, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis, this.sumUpTaxBasis, this.getInputData().partTaxReducingAmount)
    const netAmount = helpers.round(this.getInputData().grossAmount - socialContributions - healthContribution - ppkContribution - taxAmount, 2)

    this.sumUpContributionBasis = helpers.round(this.sumUpContributionBasis + contributionBasis, 2)
    this.sumUpTaxBasis = helpers.round(this.sumUpTaxBasis + taxBasis, 0)
    this.sumUpGrossAmount = helpers.round(this.sumUpGrossAmount + this.getInputData().grossAmount, 2)

    this.result = {
      grossAmount: this.getInputData().grossAmount,
      ppkIncomeFromEmployer: employerPpkpkContribution,
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
