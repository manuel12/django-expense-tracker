/**  Class to represent a budget instance.  */
class Budget {
  constructor(data) {
    this.amount = data.amount;
  }

  getDecimalAmount(decimalPlaces = 2) {
    return this.amount.toFixed(decimalPlaces);
  }
}

module.exports = { Budget }