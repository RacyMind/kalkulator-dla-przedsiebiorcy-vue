export const getBillableHours = (plannedHours = 0, leaveHours = 0): number => {
  return Math.max(0, plannedHours - leaveHours)
}

export const getHourlyRevenue = (hourlyRate = 0, plannedHours = 0, leaveHours = 0): number => {
  return hourlyRate * getBillableHours(plannedHours, leaveHours)
}
