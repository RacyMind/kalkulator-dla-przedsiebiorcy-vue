import {ContributionBasises} from 'src/composables/contributionBasises'
import {CustomCalculator} from 'components/accountingWithSpouse/logic/CustomCalculator'
import {EmployeeCalculator} from 'components/accountingWithSpouse/logic/EmployeeCalculator'
import {EntrepreneurCalculator} from 'components/accountingWithSpouse/logic/EntrepreneurCalculator'
import {EntrepreneurFormFields, FormFields, FormType} from 'components/accountingWithSpouse/interfaces/FormFields'
import {JointAccountingCalculator} from 'components/accountingWithSpouse/logic/JointAccountingCalculator'
import {JointAccountingResult} from 'components/accountingWithSpouse/interfaces/JointAccountingResult'
import {acceptHMRUpdate, defineStore} from 'pinia'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

type Store = {
  husband: FormFields | undefined
  wife: FormFields | undefined
}

const getContributionBasis = (currentMonth: number, fields: EntrepreneurFormFields): number => {
  const { zusConstants } = useConstants()

  if(fields.chosenContributionBasis === ContributionBasises.Custom) {
    return fields.customContributionBasis ?? 0
  }
  if(fields.chosenContributionBasis === ContributionBasises.Small) {
    return zusConstants.value.entrepreneur.basises.small(currentMonth)
  }

  return zusConstants.value.entrepreneur.basises.big
}

const getResult = (fields:FormFields) => {
  switch (fields.formType) {
    case FormType.Custom:
      return new CustomCalculator()
        .setInputData({
          ...fields.custom,
        })
        .calculate()
        .getResult()
    case FormType.Unemployment:
      return new CustomCalculator()
        .setInputData({
          revenue:0,
          expenses: 0,
          socialContributions: 0,
          healthContributions: 0,
          hasTaxRelief: false,
        })
        .calculate()
        .getResult()
    case FormType.EmploymentContract:
      const grossAmounts: number[] = []

      for(let i = 0; i < 12; i++) {
        grossAmounts.push(Number(fields.employee.hasAmountForEachMonth ? fields.employee.grossAmounts[i] : fields.employee.grossAmount))
      }
      return new EmployeeCalculator()
        .setInputData({
          grossAmounts: grossAmounts,
          hasTaxRelief: fields.employee.hasTaxRelief,
          workInLivePlace: fields.employee.workInLivePlace,
          partOfWorkWithAuthorExpenses: fields.employee.areAuthorExpenses ? helpers.round(fields.employee.partOfWorkWithAuthorExpenses / 100, 2) : 0,
          isDisabilityContribution: fields.employee.isDisabilityContribution,
          isHealthContribution: fields.employee.isHealthContribution,
          isPensionContribution: fields.employee.isPensionContribution,
          isSickContribution: fields.employee.isSickContribution,
          employeePpkContributionRate: fields.employee.isPpkContribution ? helpers.round(fields.employee.employeePpkContributionRate / 100, 4) : 0,
          employerPpkContributionRate: fields.employee.isPpkContribution ? helpers.round(fields.employee.employerPpkContributionRate / 100, 4) : 0,
        })
        .calculate()
        .getResult()
    case FormType.Entrepreneur:
      const revenueAmounts: number[] = []
      const expensesAmounts: number[] = []
      const contributionBasises: number[] = []

      for(let i = 0; i < 12; i++) {
        revenueAmounts.push(Number(fields.entrepreneur.hasRevenueForEachMonth ? fields.entrepreneur.revenueAmounts[i] : fields.entrepreneur.revenue))
        expensesAmounts.push(Number(fields.entrepreneur.hasExpensesForEachMonth ? fields.entrepreneur.expensesAmounts[i] : fields.entrepreneur.expenses))
        contributionBasises.push(getContributionBasis(i, fields.entrepreneur))
      }

      return new EntrepreneurCalculator()
        .setInputData({
          revenues: revenueAmounts,
          expenses: expensesAmounts,
          hasTaxRelief: fields.entrepreneur.hasTaxRelief,
          isSickContribution: fields.entrepreneur.isSickContribution,
          isFpContribution: fields.entrepreneur.isFpContribution,
          hasEmploymentContract: fields.entrepreneur.hasEmploymentContract,
          accidentContributionRate: helpers.round(fields.entrepreneur.accidentContributionRate / 100, 4),
          contributionBasises: contributionBasises,
          previousMonthHealthContributionBasis: fields.entrepreneur.healthContributionBasisInJanuary,
        })
        .calculate()
        .getResult()
  }
}

export const useAccountingWithSpouseStore = defineStore('accounting-with-spouse', {
  state: ():Store => ({
    husband: undefined,
    wife: undefined,
  }),
  getters: {
    husbandResult(state) {
      if(state.husband === undefined) {
        return undefined
      }
      return getResult(state.husband)
    },
    wifeResult(state) {
      if(state.wife === undefined) {
        return undefined
      }
      return getResult(state.wife)
    },
    jointResult(state):undefined | JointAccountingResult {
      if(state.husband === undefined || state.wife === undefined) {
        return undefined
      }

      const husbandResult = getResult(state.husband)
      const wifeResult = getResult(state.wife)

      return new JointAccountingCalculator().setInputData({
        husband: {
          revenue: husbandResult.revenue,
          expenses: husbandResult.expenses,
          taxBasis: husbandResult.taxBasis,
          totalContributions: husbandResult.totalContributions,
        },
        wife: {
          revenue: wifeResult.revenue,
          expenses: wifeResult.expenses,
          taxBasis: wifeResult.taxBasis,
          totalContributions: wifeResult.totalContributions,
        },
      })
        .calculate()
        .getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountingWithSpouseStore, import.meta.hot))
}
