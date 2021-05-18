exports.serializeUser = user => {
  const { firstName, lastName, createdAt, updatedAt, roleId, ...restUser } = user;
  delete restUser.password;

  return {
    first_name: firstName,
    last_name: lastName,
    created_at: createdAt,
    updated_at: updatedAt,
    role_id: roleId,
    ...restUser
  };
};

exports.serializeUsers = users => users.map(exports.serializeUser);
