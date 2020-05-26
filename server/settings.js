env_path = process.env.ENV_PATH ? process.env.ENV_PATH : './.env';
require('dotenv').config({path:env_path})
SETTINGS = process.env;

module.exports = SETTINGS;