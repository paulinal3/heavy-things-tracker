# Set Up For Use on Local Machine (Mac & Postgres)

Here's how to download and run this application on your local mac:

* Fork & Clone
* `npm i` to install dependencies
* create database with `createdb express_auth_development`
* if your postgress process requires a username and password, add these to the `config/config.json` file
* migrate models to your database with `sequelize db:migrate` (This command assumes you have the sequelize-cli installed globally. If you don't, run `npm i sequelize-cli` to install in this project.)




