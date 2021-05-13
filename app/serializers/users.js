exports.serializeUser = user => {
  const { firstName, lastName, createdAt, updatedAt, ...restUser } = user;
  delete restUser.password;

  return {
    first_name: firstName,
    last_name: lastName,
    created_at: createdAt,
    updated_at: updatedAt,
    ...restUser
  };
};

exports.serializeUsers = users => users.map(exports.serializeUser);
