import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import taxes from 'src/logic/taxes'
import ownerContributions from 'src/logic/ownerContributions'
import {AvailableYear} from 'src/types/AvailableYear'
import {PartialZusContributionInputFields} from 'components/partialZusContributions/interfaces/PartialZusContributionInputFields'
import {PartialZusContributionResult} from 'components/partialZusContributions/interfaces/PartialZusContributionResult'

let params = {
  bigBasisForZUS: constants.PARAMS[helpers.getDefaultYear()].ZUS.OWNER.BIG_AMOUNT,
  smallBasisForZUS: constants.PARAMS[helpers.getDefaultYear()].ZUS.OWNER.SMALL_AMOUNT,
}

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    bigBasisForZUS: constants.PARAMS[year].ZUS.OWNER.BIG_AMOUNT,
    smallBasisForZUS: constants.PARAMS[year].ZUS.OWNER.SMALL_AMOUNT,
  }

  taxes.setParams(year)
  ownerContributions.setParams(year)
}

/**
 * Returns the result
 * @param input
 */
function getResult (input:PartialZusContributionInputFields):PartialZusContributionResult {
  let basisForZus = 0
  let fpContribution = 0
  let sickContribution = 0

  if (input.isSmallZus) {
    input.isFpContribution = false
    basisForZus = params.smallBasisForZUS
  } else {
    basisForZus = params.bigBasisForZUS
  }

  if (input.customBasisForZus) {
    basisForZus = input.customBasisForZus
  }

  basisForZus /= input.daysInMonth
  basisForZus *= input.daysOfRunningBusiness
  basisForZus = helpers.round(basisForZus, 2)

    const pensionContribution = ownerContributions.calculatePensionContribution(basisForZus)
    const disabilityContribution = ownerContributions.calculateDisabilityContribution(basisForZus)
    const accidentContribution = ownerContributions.calculateAccidentContribution(basisForZus, input.accidentContributionRate)

  if (input.isFpContribution) {
    fpContribution = ownerContributions.calculateFpContribution(basisForZus)
  }

  if (input.isSickContribution) {
    sickContribution = ownerContributions.calculateSickContribution(basisForZus)
  }
  return {
    accidentContribution: accidentContribution,
    basisForZusContributions: basisForZus,
    contributionTotal: pensionContribution + disabilityContribution + sickContribution + accidentContribution + fpContribution,
    disabilityContribution: disabilityContribution,
    fpContribution: fpContribution,
    pensionContribution: pensionContribution,
    sickContribution: sickContribution,
  }
}

export default {
  getResult,
  setParams,
}
