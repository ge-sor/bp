class BadRequestError extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
