import dotenv from 'dotenv'
import path from 'path'

// const envFileName = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
const envFileName = '.env'
// This config must come before all other imports that rely on process.env
//  and any variables that use process.env (other than IS_PRODUCTION)
dotenv.config({ path: path.join(__dirname, `../../${envFileName}`) })

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

const envVars = process.env

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  slack: {
    bot: {
      token: {
        priceAlert: envVars.SLACKBOT_TOKEN__PRICE_ALERT,
        meepMoop: envVars.SLACKBOT_TOKEN__MEEP_MOOP,
      },
      id: { // app id
        priceAlert: envVars.SLACKBOT_APP_ID__PRICE_ALERT,
        meepMoop: envVars.SLACKBOT_APP_ID__MEEP_MOOP,
      },
    },
    signingSecret: {
      priceAlert: envVars.SLACKBOT_SIGNING_KEY__PRICE_ALERT,
      meepMoop: envVars.SLACKBOT_SIGNING_KEY__MEEP_MOOP,
    },
  },
}
