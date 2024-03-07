import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/contractWork/interfaces/InputFields'
import {Result} from 'components/contractWork/interfaces/Result'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class ContractWorkCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result>{
  protected readonly incomeTaxConstants
  protected readonly incomeTax: TaxScale

  constructor() {
    super()
    const { incomeTaxConstants} = useConstants()

    this.incomeTaxConstants = incomeTaxConstants
    this.incomeTax = new TaxScale()
  }

  protected getExpenses(basisForExpenses:number):number {
    const expenseRate = this.getInputData().canLumpSumTaxBe && this.getInputData().grossAmount <= this.incomeTaxConstants.value.taxScale.expenses.withoutExpensesUpTo ? 0 : this.getInputData().expenseRate

    const expenses = helpers.round(basisForExpenses * expenseRate, 2)

    if(expenseRate === this.incomeTaxConstants.value.taxScale.expenses.rates.author) {
      return Math.min(expenses, this.incomeTaxConstants.value.taxScale.taxThreshold)
    }

    return expenses
  }

  public calculate():this{
    const expenses = this.getExpenses(this.getInputData().grossAmount)
    const taxBasis =  Math.max(helpers.round(this.getInputData().grossAmount - expenses, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis, 0, 0)
    const netAmount = helpers.round(this.getInputData().grossAmount -  taxAmount, 2)

    this.result = {
      grossAmount: this.getInputData().grossAmount,
      expenses,
      taxBasis,
      taxAmount,
      netAmount,
    }

    return this
  }
}
