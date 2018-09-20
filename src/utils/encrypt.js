import crypto from 'crypto-js'

export const encrypt = (text, password) => crypto.AES.encrypt(text, password).toString()

export const decrypt = (secret, password) => {
  return crypto.AES.decrypt(secret, password).toString(crypto.enc.Utf8)
}
