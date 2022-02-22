import helpers from 'src/logic/helpers'
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {InterestResult} from 'components/interest/interfaces/InterestResult'

/**
 * Returns the result
 *
 * @param {InterestInputFields} input
 * @returns {InterestResult}
 */
function getResult (input:InterestInputFields):InterestResult {
  const interestAmount = helpers.round(input.amount * input.rate * input.dayCount / 365, 2)

  return {
    interestAmount: interestAmount,
    dayCount: input.dayCount,
    amount: input.amount,
  }
}

export default { getResult }
