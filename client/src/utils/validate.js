export const validateEmail = email => {
  const regex = /^\S+@\S+$/;
  return regex.test(String(email).toLowerCase());
};

const makeCommaSeparatedString = (arr, useOxfordComma) => {
  const listStart = arr.slice(0, -1).join(', ');
  const listEnd = arr.slice(-1);
  const conjunction =
    arr.length <= 1
      ? ''
      : useOxfordComma && arr.length > 2
      ? ', and a'
      : ' and a ';

  return [listStart, listEnd].join(conjunction);
};

export const validatePassword = password => {
  const form = { msg: [], hasError: false };
  if (!password.match(/[$-/:-?{-~!"^_`[\]]/g)) {
    form.msg.push('symbol');
    form.hasError = true;
  }

  if (!password.match(/\d/g)) {
    form.msg.push('number');
    form.hasError = true;
  }

  if (!password.match(/[A-Z]/g)) {
    form.msg.push('uppercase letter');
    form.hasError = true;
  }
  if (!password.match(/[a-z]/g)) {
    form.msg.push('lowercase letter');
    form.hasError = true;
  }

  const msg = makeCommaSeparatedString(form.msg);

  return form.hasError ? msg : '';
};
