import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {JointAccountingInputFields} from 'components/accountingWithSpouse/interfaces/JointAccountingInputFields'
import {JointAccountingResult} from 'components/accountingWithSpouse/interfaces/JointAccountingResult'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import helpers from 'src/logic/helpers'

export class JointAccountingCalculator extends BasicCalculator<JointAccountingInputFields, JointAccountingResult> implements Calculator<JointAccountingInputFields, JointAccountingResult>{
  protected readonly incomeTax: TaxScale
  constructor() {
    super()
    this.incomeTax = new TaxScale()
  }

  public calculate():this{
    const totalTaxBasis = helpers.round(this.getInputData().husband.taxBasis + this.getInputData().wife.taxBasis, 0)
    const taxBasis = helpers.round(totalTaxBasis / 2, 2)

    const revenue = helpers.round(this.getInputData().husband.revenue + this.getInputData().wife.revenue, 2)
    const expenses = helpers.round(this.getInputData().husband.expenses + this.getInputData().wife.expenses, 2)
    const totalContributions = helpers.round(this.getInputData().husband.totalContributions + this.getInputData().wife.totalContributions, 2)
    const taxAmount = helpers.round(this.incomeTax.getIncomeTax(taxBasis, 0, 1) * 2, 0)
    const income = helpers.round(revenue - expenses - totalContributions - taxAmount, 2)

    this.result = {
      revenue: helpers.round(this.getInputData().husband.revenue + this.getInputData().wife.revenue, 2),
      totalContributions,
      taxBasis: totalTaxBasis,
      taxAmount,
      income,
    }

    return this
  }
}
