import { ErrorHandler, handlers, Handlers } from './handlers';

class ErrorHandlers {
  private handlers = new Map<string, ErrorHandler>();

  constructor(handlers: Handlers) {
    const errNames = Object.keys(handlers);
    for (const errName of errNames) {
      this.handlers.set(errName, handlers[errName]);
    }
  }

  get(errName: string): ErrorHandler {
    return this.handlers.get(errName) || this.handlers.get('default')!;
  }

  set(errName: string, handler: ErrorHandler) {
    if (this.handlers.has(errName))
      throw new Error(
        `${errName} handler is already exist. Your changes will have no effect`
      );
    this.handlers.set(errName, handler);
  }
}

export const errorHandlers = new ErrorHandlers(handlers);
