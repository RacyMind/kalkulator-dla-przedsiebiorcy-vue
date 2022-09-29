import {AvailableYear} from 'src/types/AvailableYear'

export interface SalaryForUnusedHolidaysFields {
  amount: number
  dailyNorm: number
  holidayHours: number
  year: AvailableYear,
  workingTime: number
}
