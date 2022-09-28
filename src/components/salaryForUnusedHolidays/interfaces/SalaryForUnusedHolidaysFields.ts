import {AvailableYear} from 'src/types/AvailableYear'

export interface SalaryForUnusedHolidaysFields {
  year: AvailableYear,
  amount: number
  holidayHours: number
  workingTime: number
}
