"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressWinstonConfig = void 0;
const winston_1 = __importDefault(require("winston"));
exports.expressWinstonConfig = {
    transports: [
        new winston_1.default.transports.Console(),
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: (req, res) => false, // optional: allows to skip some log messages based on request and/or response
};
