class AuthError extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 401;
  }
}

export default AuthError;
