import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {InterestResult} from 'components/interest/interfaces/InterestResult'
import helpers from 'src/logic/helpers'

/**
 * Returns the result
 *
 * @param {InterestInputFields} input
 * @returns {InterestResult}
 */
function getResult (input:InterestInputFields):InterestResult {
  const interestAmount = helpers.round(input.amount * input.rate * input.dayCount / 365, 2)

  return {
    amount: input.amount,
    dayCount: input.dayCount,
    interestAmount: interestAmount,
  }
}

export default { getResult }
