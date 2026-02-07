import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeInputFields} from 'components/accountingWithSpouse/interfaces/EmployeeInputFields'
import {EmployeeResult} from 'components/accountingWithSpouse/interfaces/EmployeeResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class EmployeeCalculator extends BasicCalculator<EmployeeInputFields, EmployeeResult> implements Calculator<EmployeeInputFields, EmployeeResult>{
  protected readonly incomeTaxConstants
  protected readonly employeeZus: EmployeeZusContribution
  protected readonly incomeTax: TaxScale
  constructor() {
    super()
    const { incomeTaxConstants} = storeToRefs(useConstantsStore())

    this.incomeTaxConstants = incomeTaxConstants
    this.employeeZus = new EmployeeZusContribution()
    this.incomeTax = new TaxScale()
  }

  protected getExpenses(basisForExpenses:number):number {
    const { incomeTaxConstants } = storeToRefs(useConstantsStore())
    let expenses = 0


    if(this.getInputData().partOfWorkWithAuthorExpenses < 1) {
      this.getInputData().grossAmounts.forEach((grossAMount) => {
        if (grossAMount) {
          expenses += this.getInputData().workInLivePlace ? incomeTaxConstants.value.taxScale.expenses.amounts.workInLivingPlace : incomeTaxConstants.value.taxScale.expenses.amounts.workOutsideLivingPlace
        }
      })
    }

    const authorExpenses = this.incomeTax.getAuthorExpenses(basisForExpenses, this.getInputData().partOfWorkWithAuthorExpenses, this.getInputData().hasTaxRelief, 0)

    return expenses + authorExpenses
  }
  public calculate():this{
    let employerPpkContribution = 0

    const totalGrossAmount = this.getInputData().grossAmounts.reduce((accumulator:number, grosAmount:number) => {
      return helpers.round(accumulator + grosAmount, 2)
    }, 0)

    const contributionBasis = this.employeeZus.getContributionBasisWithinLimit(totalGrossAmount)

    const {
      pensionContribution,
      disabilityContribution,
      sickContribution,
      ppkContribution,
      healthContribution,
      socialContributions,
      totalContributions,
    } = this.employeeZus.getZusContributions(
      totalGrossAmount,
      contributionBasis,
      this.getInputData().isPensionContribution,
      this.getInputData().isDisabilityContribution,
      this.getInputData().isSickContribution,
      this.getInputData().isHealthContribution,
      this.getInputData().employeePpkContributionRate,
    )

    if (this.getInputData().employerPpkContributionRate) {
      const employerZUs = new EmployerZusContribution()
      employerPpkContribution = employerZUs.getPPKContribution(totalGrossAmount, this.getInputData().employerPpkContributionRate)
    }


    const salaryAmountOverTaxReliefLimit = this.incomeTax.geRevenueOverTaxReliefLimit(totalGrossAmount + employerPpkContribution, 0, this.getInputData().hasTaxRelief)
    const expenses = this.getExpenses(salaryAmountOverTaxReliefLimit - socialContributions)
    const taxBasis =  Math.max(helpers.round(salaryAmountOverTaxReliefLimit - socialContributions - expenses, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis,0, 1)
    const netAmount = helpers.round(totalGrossAmount - socialContributions - healthContribution - ppkContribution - taxAmount, 2)
    const revenue = helpers.round(totalGrossAmount + employerPpkContribution, 2)

    this.result = {
      grossAmount: totalGrossAmount,
      revenue,
      ppkIncomeFromEmployer: employerPpkContribution,
      healthContribution,
      sickContribution,
      ppkContribution,
      pensionContribution,
      disabilityContribution,
      totalContributions,
      expenses,
      taxBasis,
      taxAmount,
      netAmount,
    }

    return this
  }
}
