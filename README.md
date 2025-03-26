## Description

An app where you can buy tickets

## Prerequisites

PotgreSQL@15 https://formulae.brew.sh/formula/postgresql@15
Node.js@22 https://formulae.brew.sh/formula/node@22

## Initialize DB

```bash
$ cd backend/src
$ chmod a+x initialize.sh
$ ./create_db.sh your_db_name your_db_user
```

Your default user should be `postgres`

This will create a fresh db with

If this doesn't work just enable the commented line inside `app.module.ts` on `line 36`

## Project setup API

```bash
 $ cd backend
```

```bash
$ npm install
```

## Compile and run the project

```bash
# watch mode
$ npm run start:dev
```

## Project setup Frondend

```bash
 $ cd frontend/tick_t
```

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start
```
