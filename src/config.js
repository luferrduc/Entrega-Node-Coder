import { config } from "dotenv"
import { Command } from "commander" 
import { __dirname } from "./utils.js"
import { join } from "node:path"


const program = new Command()
program.option("--mode <mode>", "variable de ambiente de desarrollo", "DEV")
program.parse()

// DEVELOPMENT = DEV, PRODUCTION = PROD
const environment = program.opts().mode

config({
  path: (environment === 'DEV') ? `./.env.development` : `./.env.production`,

})

const configs = {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGO_URL,
  persistence: process.env.PERSISTENCE || 'MONGO',
  privateKeyJWT: process.env.PRIVATE_KEY_JWT,
  userNodeMailer: process.env.USER_NODEMAILER,
  passwordNodeMailer: process.env.PASSWORD_NODEMAILER,
  environment,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}

export default configs