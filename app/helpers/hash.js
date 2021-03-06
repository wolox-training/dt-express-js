const bcrypt = require('bcrypt');

exports.getHashedPassword = password => bcrypt.hash(password, 5);

exports.comparePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
