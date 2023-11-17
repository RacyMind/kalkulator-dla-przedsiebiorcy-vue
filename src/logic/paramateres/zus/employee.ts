import helpers from 'src/logic/helpers'

/**
 * Oprocentowanie składki zdrowotnej
 */
export const healthContributionRate = (): number => {
  return 0.09
}
/**
 * Oprocentowanie składki rentowej
 */
export const disabilityContributionRate = (): number => {
  return 0.015
}
/**
 * Oprocentowanie składki emerytalnej
 */
export const pensionContributionRate = (): number => {
  return 0.0976
}
/**
 * Oprocentowanie składki chorobowej
 */
export const sickContributionRate = (): number => {
  return 0.0245
}
/**
 * Limit podstawy składek ZUS
 */
export const limitOfBasisForContributions = (): number => {
  return 208050
}
/**
 * Returns the health contribution of the employee
 */
export const getHealthContribution =  (amount: number): number => {
  return helpers.round(healthContributionRate() * amount, 2)
}
/**
 * Returns the disability contribution of the employee
 */
export const geDisabilityContribution =  (amount: number): number => {
  return helpers.round(disabilityContributionRate() * amount, 2)
}
/**
 * Returns the pension contribution of the employee
 */
export const gePensionContribution =  (amount: number): number => {
  return helpers.round(pensionContributionRate() * amount, 2)
}
/**
 * Returns the sick contribution of the employee
 */
export const getSickContribution =  (amount: number): number => {
  return helpers.round(sickContributionRate() * amount, 2)
}
/**
 * Returns the PPK (Pracownicze Plany Kapitałowe) contribution of the employee
 */
export const getPPKContribution =  (grossAmount: number, ppkRate: number): number => {
  return helpers.round(ppkRate * grossAmount, 2)
}
