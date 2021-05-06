exports.mapUser = userInfo => {
  const { first_name: firstName, last_name: lastName, ...restUserInfo } = userInfo;

  return { firstName, lastName, ...restUserInfo };
};
