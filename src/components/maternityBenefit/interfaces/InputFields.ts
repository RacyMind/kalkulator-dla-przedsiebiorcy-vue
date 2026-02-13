import {
  ChildrenCount,
  EmploymentType,
  ZusType,
} from 'components/maternityBenefit/types'

export interface InputFields {
  readonly employmentType: EmploymentType
  readonly zusType: ZusType
  readonly averageBasis: number
  readonly childrenCount: ChildrenCount
}
