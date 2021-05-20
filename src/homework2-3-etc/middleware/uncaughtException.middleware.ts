export const uncaughtExceptionMiddleware = (err: Error): void => {
  console.error(`Uncaught error: ${err.message}`);
  process.exit(1);
};
