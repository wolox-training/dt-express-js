exports.serializeUser = user => {
  const { firstName, lastName, ...restUser } = user;
  delete restUser.password;

  return { first_name: firstName, last_name: lastName, ...restUser };
};
