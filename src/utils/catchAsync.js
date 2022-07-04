"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a function that, when called, catches any error in async callback (for router)
 * @param {function} callback
 * @return {() => Promise<any>}
 */
function catchAsync(callback) {
    return (req, res, next) => {
        Promise.resolve(callback(req, res, next)).catch((err) => next(err));
    };
}
exports.default = catchAsync;
