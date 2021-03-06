exports.serializeWeet = weet => {
  const { createdAt, updatedAt, userId, ...restWeet } = weet;

  return {
    created_at: createdAt,
    updated_at: updatedAt,
    user_id: userId,
    ...restWeet
  };
};

exports.serializeWeets = weets => weets.map(weet => exports.serializeWeet(weet));
