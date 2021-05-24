exports.joke =
  'MacGyver immediately tried to make a bomb out of some Q-Tips and Gatorade, but Chuck Norris roundhouse-kicked him in the solar plexus. MacGyver promptly threw up his own heart.';

exports.expectedCreatedWeet = {
  content: exports.joke
};

exports.weets = [...Array(5).keys()].map(index => ({ content: `test joke ${index}` }));

exports.getExpectedWeetsInfo = userId => exports.weets.map(weet => ({ ...weet, user_id: userId }));
