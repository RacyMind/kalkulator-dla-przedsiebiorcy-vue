class CurrencyConverter {
  /**
   * Przelicza walutę z jednej na drugą
   */
  convert (amount, from, to) {
    return amount * from / to
  }
}

export default CurrencyConverter
