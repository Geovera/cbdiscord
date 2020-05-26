env_path = process.cwd() + '/.env'
require('dotenv').config(env_path)
SETTINGS = process.env;

module.exports = SETTINGS;