export const RegexpValidators = {
  EMAIL: /^[A-Za-z0-9+_.-]+@(.+)$/,
  PASSWORD_NUMBER: /\d/,
  PASSWORD_LENGTH: /[a-zA-Z\d$&+,:;=?~@%{}#|/'<>.^*()%!-]{8,50}/,
  SPECIAL_CHARACTERS: /[$&+,:;=?~@%{}#|/'<>.^*()%!-]/,
  BIG_LETTER: /[A-Z]+/,
  SMALL_LETTER: /[a-z]+/,
  STRING_LENGTH: /^.{6,12}$/,
  USERNAME_LETTERS_ONLY: /^[a-zA-Z]+$/,
  PESEL: /^\d{11}$/,
  PHONE_NUMBER: /^\d{9}$/
};