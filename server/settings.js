env_path = process.env.ENV_PATH ? process.env.ENV_PATH : '';
require('dotenv').config(env_path)
SETTINGS = process.env;

module.exports = SETTINGS;