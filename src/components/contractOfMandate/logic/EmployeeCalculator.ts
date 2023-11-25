import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeResult} from 'components/contractOfMandate/interfaces/EmployeeResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export class EmployeeCalculator implements Calculator<InputFields, EmployeeResult>{
  protected readonly employeeZus: EmployeeZusContribution
  protected readonly incomeTax: GeneraLRule
  protected inputData: InputFields | undefined
  protected result: EmployeeResult | undefined
  protected isPartOfAnnualResult = false
  protected sumUpContributionBasis = 0
  protected sumUpTaxBasis = 0
  protected sumUpAuthorExpenses = 0
  protected sumUpGrossAmount = 0

  /**
   * @param isPartOfAnnualResult if isPartOfAnnualResult is true, it saves important values for next month calculations
   */
  constructor(isPartOfAnnualResult = false) {
    this.isPartOfAnnualResult = isPartOfAnnualResult
    this.employeeZus = new EmployeeZusContribution()
    this.incomeTax = new GeneraLRule()
  }

  public setInputData(input:InputFields):this {
    this.inputData = input
    return this
  }

  public getResult():EmployeeResult {
    if( this.result === undefined) {
      throw Error('The result is undefined!')
    }
    return this.result
  }

  protected getInputData():InputFields {
    if( this.inputData === undefined) {
      throw Error('The input data is undefined!')
    }
    return this.inputData
  }

  protected getAuthorExpenses(basisForAuthorExpenses:number):number {
    if (!this.getInputData().partOfWorkWithAuthorExpenses) {
      return 0
    }

    let realThreshold = GeneraLRule.taxThreshold

    if(this.getInputData().hasTaxRelief) {
      // it's reduced because the sum of the tax relief and the expense limit can't be more than the the tax threshold
      realThreshold = GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit
    }

    if(this.sumUpAuthorExpenses >= realThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForAuthorExpenses * this.getInputData().partOfWorkWithAuthorExpenses * GeneraLRule.authorExpenseRate, 2)

    if(expenses + this.sumUpAuthorExpenses > realThreshold) {
      return realThreshold - this.sumUpAuthorExpenses
    }

    return expenses
  }

  protected getExpenses(basisForExpenses:number):number {
    const expenseRate = this.getInputData().canLumpSumTaxBe && this.getInputData().grossAmount <= GeneraLRule.withoutExpensesUpTo ? 0 : GeneraLRule.defaultExpenseRate

    const partOfWorkWithoutAuthorExpenses = 1 - this.getInputData().partOfWorkWithAuthorExpenses

    const expenses = helpers.round(basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate, 2)

    const authorExpenses = this.getAuthorExpenses(basisForExpenses)
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

    const contributionBasis = this.employeeZus.getContributionBasis(this.getInputData().grossAmount, this.sumUpContributionBasis)

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

    const salaryAmountOverTaxReliefLimit = this.incomeTax.getSalaryAmountOverTaxReliefLimit(this.getInputData().grossAmount + employerPpkpkContribution, this.sumUpGrossAmount, this.getInputData().hasTaxRelief)
    const expenses = this.getExpenses(salaryAmountOverTaxReliefLimit - socialContributions)
    const taxBasis =  helpers.round(salaryAmountOverTaxReliefLimit - socialContributions - expenses, 0)
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

    if(!this.isPartOfAnnualResult) {
      this.sumUpTaxBasis = 0
      this.sumUpContributionBasis = 0
      this.sumUpAuthorExpenses = 0
      this.sumUpGrossAmount = 0
    }

    return this
  }
}
