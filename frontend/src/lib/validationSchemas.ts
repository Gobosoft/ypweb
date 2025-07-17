import i18n from '../i18n'
import * as Yup from 'yup'

export const passwordValidationYup = () =>
  Yup.string()
    .min(8, () => i18n.t('passwordValidation.passwordLength'))
    .matches(/[a-z]/, () => i18n.t('passwordValidation.lowercaseLetter'))
    .matches(/[A-Z]/, () => i18n.t('passwordValidation.uppercaseLetter'))
    .matches(/[0-9]/, () => i18n.t('passwordValidation.digit'))
    .matches(/[!@#$%^&*]/, () => i18n.t('passwordValidation.specialCharacter'))
    .required(() => i18n.t('fieldValidation.required'))

export const passwordVerifyValidationYup = () =>
  Yup.string()
    .oneOf([Yup.ref('password'), undefined], () => i18n.t('passwordsDontMatch'))
    .required(() => i18n.t('fieldValidation.required'))

export const validationSchemaRegister = () =>
  Yup.object().shape({
    email: Yup.string()
      .email(i18n.t('emailValidation.invalidFormat'))
      .required(i18n.t('fieldValidation.required')),
    password: passwordValidationYup(),
    verifyPassword: passwordVerifyValidationYup(),
  })
