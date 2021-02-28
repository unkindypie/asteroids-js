/**
 * Thrown on "abstract" methods
 */
class NotImplementedError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
    this.message = `${message || 'Method'} is not implemented.`;
  }
}

export default NotImplementedError;
