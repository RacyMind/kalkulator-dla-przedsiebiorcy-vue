import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployeeInputFields} from 'components/accountingWithSpouse/interfaces/EmployeeInputFields'
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class EmployeeCalculator extends BasicCalculator<EmployeeInputFields, EmployeeResult> implements Calculator<EmployeeInputFields, EmployeeResult>{
  protected readonly incomeTaxConstants
  protected readonly employeeZus: EmployeeZusContribution
  protected readonly incomeTax: TaxScale
  protected calculateSumUpAmounts = false
  constructor() {
    super()
    const { incomeTaxConstants} = useConstants()

    this.incomeTaxConstants = incomeTaxConstants
    this.employeeZus = new EmployeeZusContribution()
    this.incomeTax = new TaxScale()
  }

  protected getExpenses():number {
    const { incomeTaxConstants } = useConstants()
    let expenses = 0

    this.getInputData().grossAmounts.forEach((grossAMount) => {
      if(grossAMount) {
        expenses += this.getInputData().workInLivePlace ? incomeTaxConstants.value.taxScale.expenses.amounts.workInLivingPlace : incomeTaxConstants.value.taxScale.expenses.amounts.workOutsideLivingPlace
      }

    })

    return expenses
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

    const partTaxReducingAmount = this.getInputData().hasTaxFreeAmount ? 1 : 0

    const salaryAmountOverTaxReliefLimit = this.incomeTax.geRevenueOverTaxReliefLimit(totalGrossAmount + employerPpkContribution, 0, this.getInputData().hasTaxRelief)
    const expenses = this.getExpenses()
    const taxBasis =  Math.max(helpers.round(salaryAmountOverTaxReliefLimit - socialContributions - expenses, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis,0, partTaxReducingAmount)
    const netAmount = helpers.round(totalGrossAmount - socialContributions - healthContribution - ppkContribution - taxAmount, 2)

    this.result = {
      grossAmount: totalGrossAmount,
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

    return this
  }
}
