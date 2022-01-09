
/**  Class with static methods that generate various needed dates.  */
class DateGenerator {
  static getDate(date) {
    return date ? new Date(date) : new Date();
  }

  static getDateOneMonthAgo() {
    let date = DateGenerator.getDate();
    date = date.setMonth(date.getMonth() - 1);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateTwoMonthAgo() {
    let date = DateGenerator.getDate();
    date = date.setMonth(date.getMonth() - 2);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateThreeMonthAgo() {
    let date = DateGenerator.getDate();
    date = date.setMonth(date.getMonth() - 3);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateOneWeekAgo() {
    let date = DateGenerator.getDate();
    date = date.setDate(date.getDate() - 7);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateTwoWeeksAgo() {
    let date = DateGenerator.getDate();
    date = date.setDate(date.getDate() - 14);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateThreeWeeksAgo() {
    let date = DateGenerator.getDate();
    date = date.setDate(date.getDate() - 21);
    return DateGenerator.getFormatedDate(date);
  }

  static getFormatedDate(dateParam) {
    // Returns a date of format "yyyy-mm-dd".
    let date = dateParam ? new Date(dateParam) : new Date();

    const dd = date.getDate();
    const ddStr = String(dd).padStart(2, "0");
    const mm = date.getMonth() + 1;
    const mmStr = String(mm).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${yyyy}-${mmStr}-${ddStr}`;
  }
}

module.exports = { DateGenerator }