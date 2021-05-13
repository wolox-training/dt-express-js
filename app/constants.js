exports.errorMessages = {
  providedAndNotEmpty: 'should be provided and not empty',
  validEmail: 'should be a valid email',
  woloxDomain: 'should belong to wolox domain',
  alreadyInRegisters: 'is already in our registers',
  shortPassword: 'should contain at least 8 characters',
  alphanumeric: 'should be alpha-numeric',
  integer: 'should be integer'
};

exports.regExp = {
  woloxEmail: /(\w|\.|-)+@wolox\.(\w{2}|(com(\.\w{2})?))$/i
};

exports.pagination = {
  defaultPaginationSize: 10,
  defaultPage: 0
};
