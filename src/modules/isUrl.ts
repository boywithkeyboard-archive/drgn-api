import { URL } from 'url'

const isUrl = async (url: string) => {
  try {
    new URL(url)
    return true
  } catch (err) {
    return false
  }
}

export default isUrl