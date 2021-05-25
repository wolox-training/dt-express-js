const { weet: WeetModel } = require('../../models');
const { errorMessages } = require('../../constants');

exports.createRatingSchema = {
  weetId: {
    in: 'params',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.providedAndNotEmpty,
    isInt: {
      errorMessage: errorMessages.integer
    },
    toInt: true,
    bail: true,
    custom: {
      options: weetId =>
        WeetModel.findOne({ where: { id: weetId } }).then(weet => {
          if (!weet) throw new Error(errorMessages.notFound);
        })
    }
  },
  rating: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.providedAndNotEmpty,
    isBoolean: {
      errorMessage: errorMessages.boolean
    }
  }
};
