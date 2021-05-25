const moment = require('moment');

exports.getTime = () => moment().format();

exports.isGreater = (timeA, timeB) => moment(timeA).diff(moment(timeB)) >= 0;
