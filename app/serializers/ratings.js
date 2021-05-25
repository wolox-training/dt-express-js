exports.serializeRating = rating => {
  const { createdAt, updatedAt, userId, weetId, ...restRating } = rating;

  return {
    created_at: createdAt,
    updated_at: updatedAt,
    user_id: userId,
    weet_id: weetId,
    ...restRating
  };
};
