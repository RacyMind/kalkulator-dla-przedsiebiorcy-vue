enum AmountTypes {
  Gross = 1,
  Net = 2,
}

interface EmployeeZusConstants {
  rates: {
    disabilityContribution: number,
    healthContribution: number,
    pensionContribution: number,
    ppkContribution: {
      default: number,
      min: number,
      max: number,
    },
    sickContribution: number,
  }
}

interface EmployerZusConstants {
  rates: {
    accidentCContribution: {
      default: number,
      min: number,
      max: number,
    },
    disabilityContribution: number,
    fgspContribution: number,
    fpContribution: number,
    fsContribution: number,
    pensionContribution: number,
    ppkContribution: {
      default: number,
      min: number,
      max: number,
    }
  }
}

interface zusConstants {
  // the limit of basis for sick, pension and disability contributions
  contributionBasisLimit :number,
  employee: EmployeeZusConstants,
  employer: EmployerZusConstants,
}

export const useConstants = () => {

  const zusConstants: zusConstants = {
    contributionBasisLimit: 208050,
    employee: {
      rates: {
        disabilityContribution: 0.015,
        healthContribution: 0.09,
        pensionContribution: 0.0976,
        ppkContribution: {
          default: 0.02,
          min: 0.005,
          max: 0.04,
        },
        sickContribution: 0.0245,
      },
    },
    employer: {
      rates: {
        accidentCContribution: {
          default: 0.0167,
          min: 0,
          max: 0.0333,
        },
        disabilityContribution: 0.065,
        fgspContribution: 0.001,
        fpContribution: 0.01,
        fsContribution: 0.0145,
        pensionContribution: 0.0976,
        ppkContribution: {
          default: 0.015,
          min: 0.015,
          max: 0.04,
        },
      },
    },
  }

  return {
    AmountTypes,
    zusConstants,
  }
}
