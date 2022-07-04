"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// const envFileName = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
const envFileName = '.env';
// This config must come before all other imports that rely on process.env
//  and any variables that use process.env (other than IS_PRODUCTION)
dotenv_1.default.config({ path: path_1.default.join(__dirname, `../../${envFileName}`) });
// const envVarsSchema = Joi.object()
//   .keys({
//     NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
//     PORT: Joi.number().default(5000),
//
//     SLACK_BOT_TOKEN: Joi.string().required(),
//     SLACK_BOT_ID: Joi.string().required(),
//     SLACK_SIGNING_KEY: Joi.string().required(),
//   })
//   .unknown()
//
// const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)
//
// if (error) {
//   throw new Error(`Config validation error: ${error.message}`)
// }
const envVars = process.env;
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    slack: {
        bot: {
            token: envVars.SLACK_BOT_TOKEN,
            id: envVars.SLACK_BOT_ID,
        },
        signingSecret: envVars.SLACK_SIGNING_KEY,
    },
};
