import errors from '../errors.json'

type ErrorMessages =
  | 'Something Went Wrong'
  | 'Invalid Id'
  | 'Invalid Session'
  | 'Invalid Content'

class ThrowableError {
  message: ErrorMessages
  code: number

  constructor(message: ErrorMessages) {
    this.message = message
    this.code = errors[message]
  }
}

export default ThrowableError