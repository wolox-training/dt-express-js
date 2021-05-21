const axios = require('axios');

exports.get = (uri, params) => axios.get(uri, { params }).then(({ data }) => data);
