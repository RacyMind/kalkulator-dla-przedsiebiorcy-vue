import {AvailableYear} from 'src/types/AvailableYear'
import {IncomeTaxType} from 'src/types/IncomeTaxType'

export interface SelfEmploymentInputFields {
  year: AvailableYear,
  amount: number,
  incomeTaxType: IncomeTaxType,
  expenses: number,
  taxRateForLumpSum: number,
  isFreeAmount: boolean,
  isReliefForBigFamily: boolean,
  isReliefForSenior: boolean,
  isReliefForMiddleClass: boolean,
  isReliefForCompanyStart: boolean,
  isSmallZus: boolean,
  isFullTimeJob: boolean,
  isFpContribution: boolean,
  isSickContribution: boolean,
  accidentContributionRate: number,
  customBasisForZus: number,
}

