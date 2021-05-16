export default function () {
  return {
    net: null,
    gross: null,
    basisForTax: null,
    expenses: null,
    freeAmount: null,
    tax: null,
    zus: {
      health: null,
      sick: null,
      rent: null,
      pension: null,
      accident: null,
    },
    taxType: null,
    zusAccidentRate: null,
    aid: false,
    sick: false,
  }
}
