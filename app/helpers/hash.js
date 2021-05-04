const bcrypt = require('bcrypt');

exports.getHashedPassword = password => bcrypt.hash(password, 5);
