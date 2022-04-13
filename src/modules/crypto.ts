import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export const encrypt = async (text: string) => {
  const iv = randomBytes(16)
  , cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  , encryptedText = Buffer.concat([cipher.update(text), cipher.final()])
 
  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`
}

, decrypt = async (text: any) => {
  const textArray = text.split(':')
  , iv = Buffer.from(textArray.shift(), 'hex')
  , encryptedText = Buffer.from(textArray.join(':'), 'hex')
  , decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  , decryptedText = Buffer.concat([decipher.update(encryptedText), decipher.final()])
 
  return decryptedText.toString()
}