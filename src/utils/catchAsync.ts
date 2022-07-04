import { NextFunction, Response, Request } from 'express'
/**
 * Returns a function that, when called, catches any error in async callback (for router)
 * @param {function} callback
 * @return {() => Promise<any>}
 */
export default function catchAsync(callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch((err) => next(err))
  }
}
