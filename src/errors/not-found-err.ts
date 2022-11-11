class NotFoundError extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
