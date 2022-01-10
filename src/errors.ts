export interface FlashsignerError extends Error {
  code: number
}

export class UserRefuesedError extends Error implements FlashsignerError {
  code = 401

  constructor(message = 'UserRefuesedError') {
    super(message)
    this.name = 'UserRefuesedError'
  }
}

export class InconsistAddressError extends Error implements FlashsignerError {
  code = 402

  constructor(message = 'NotFoundError') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class InvalidParamsError extends Error implements FlashsignerError {
  code = 403

  constructor(message = '') {
    super(`Invalid params: ${message}`)
    this.name = 'InvalidParamsError'
  }
}

export class MissingParamsError extends Error implements FlashsignerError {
  code = 404

  constructor(message = '') {
    super(`Missing params: ${message}`)
    this.name = 'MissingParamsError'
  }
}
