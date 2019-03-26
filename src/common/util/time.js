export default {
  /**
   * type 1 包含year  其他不含year
   */
  getDateString(date, type) {
    const time = new Date(date);
    const day = time.getDate();
    const month = time.getMonth();
    const year = time.getFullYear();
    const abbrMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    if (1 === type) {
      return abbrMonth[month] + ' ' + day + ', ' + year;
    } else {
      return abbrMonth[month] + ' ' + day;
    }
  },

  formatDate(date) {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = month * 30;
    const year = month * 12;

    const now = new Date().getTime();
    const diffValue = now - date * 1000;

    if (diffValue / year >= 1) {
      return this.getDateString(date * 1000, 1);
    } else if (diffValue / week >= 1) {
      return this.getDateString(date * 1000, 2);
    } else if (diffValue / day >= 1) {
      const d = parseInt(diffValue / day);
      return `${d} day${1 === d ? '' : 's'} ago`;
    } else if (diffValue / hour >= 1) {
      const h = parseInt(diffValue / hour);
      return `${h} hour${1 === h ? '' : 's'} ago`;
    } else if (diffValue / minute >= 1) {
      const m = parseInt(diffValue / minute);
      return `${m} minute${1 === m ? '' : 's'} ago`;
    } else {
      return '1 minute ago';
    }
  },

  formatDuration(sec) {
    sec = +sec;
    const min = String(Math.floor(sec / 60)).padStart(2, '0');
    const secFormat = String(Math.floor(sec % 60)).padStart(2, '0');
    return min + ':' + secFormat;
  },

  formatZHDate(date) {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = month * 30;
    const year = month * 12;

    const now = new Date().getTime();
    const diffValue = now - date * 1000;

    if (diffValue / year >= 1) {
      return new Date(date * 1000).toFormattedString('yyyy年MM月dd日');
    } else if (diffValue / month >= 1) {
      return new Date(date * 1000).toFormattedString('MM月dd日');
    } else if (diffValue / day >= 1) {
      const d = parseInt(diffValue / day);
      return `${d} 天前`;
    } else if (diffValue / hour >= 1) {
      const h = parseInt(diffValue / hour);
      return `${h} 小时前`;
    } else if (diffValue / minute >= 1) {
      const m = parseInt(diffValue / minute);
      return `${m} 分钟前`;
    } else {
      return '刚刚';
    }
  },

  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    return Y + M + D;
  }
}
