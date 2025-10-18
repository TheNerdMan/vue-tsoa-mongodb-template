/**
 * An error that is safe to be sent to the client.
 * It does not contain sensitive information.
 * Nor does it expose internal implementation details.
 */
export class ClientSafeError extends Error {
  message: string;
  status: number;
  name: string;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = 'ClientSafeError';
    
    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, ClientSafeError.prototype);
  }
}
