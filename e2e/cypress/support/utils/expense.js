const { DateGenerator } = require("./date-generator");

/**  Class to represent an expense instance.  */
class Expense {
  constructor(data) {
    this.amount = data.amount;
    this.content = data.content;
    this.category = data.category;
    this.source = data.source;
    this.date = data.date || DateGenerator.getFormatedDate();
  }

  serialize() {
    return {
      amount: this.amount,
      content: this.content,
      category: this.category,
      source: this.source,
      date: this.date,
    };
  }
}

module.exports = { Expense }