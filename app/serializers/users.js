exports.serializeUser = user => {
  const { firstName, lastName, createdAt, updatedAt, roleId, tokenLimitTimestamp, ...restUser } = user;
  delete restUser.password;

  return {
    first_name: firstName,
    last_name: lastName,
    created_at: createdAt,
    updated_at: updatedAt,
    role_id: roleId,
    token_limit_timestamp: tokenLimitTimestamp,
    ...restUser
  };
};

exports.serializeUsers = users => users.map(exports.serializeUser);
