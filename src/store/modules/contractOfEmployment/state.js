export default function () {
  return {
    net: null,
    gross: null,
    basisForTax: null,
    expenses: null,
    authorExpensePart: null,
    tax: null,
    employeeZus: {
      health: null,
      sick: null,
      rent: null,
      pension: null,
    },
    employerZus: {
      accident: null,
      rent: null,
      pension: null,
      fp: null,
      fgsp: null,
    },
    employeePpk: null,
    employerPpk: null,
  }
}
