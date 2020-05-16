# cbdiscord

Conquy blade is the application to manage your units and house easily.

## Database setup

Instructions for databse setup pending.

## Discord Bot
Inside the discord folder.

You'll need to provide a .env file with the following:
```
DISCORD_TOKEN=SOME_TOKEN
API_URL_BASE=SOME_URL
CRYPT_SALT=SOME_SALT
CRYPT_KEY=SOME_KEY
ENC_DEC_MEDTHOD=SOME_METHOD
```

Install the packages with:
```
pip3 install -r requirements
```

And finally just run:
```
python3 bot.py
```

OR you can just invite my [bot](https://discord.com/oauth2/authorize?client_id=534070031747776534&scope=bot&permissions=36895808)!

## Web App
Inside the server folder

You'll need to provide a .env file with the following:
```
DB_HOST=SOME_DB
DB_PORT=SOME_PORT
DB_USER=SOME_USER
DB_PASS=SOME_PASSWORD
DB_NAME=SOME_NAME
SESS_KEY=SOME_KEY
PASSWORD_SALT=SOME_SALT
```

Install the node packages:
```
npm install
```

And finally just run:
```
node main.js
```
The API as well as the Web Page should be up

If you only want to run the API, just remove line 24 in main.js:
```js
app.use(serve(`${__dirname}/../web`))
```

OR you can just go to my [page](http://34.86.43.193/)!