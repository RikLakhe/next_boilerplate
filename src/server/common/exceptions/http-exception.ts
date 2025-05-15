export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype); // Restore prototype chain
  }
}
