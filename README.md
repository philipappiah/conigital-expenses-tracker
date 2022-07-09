

---

# conigital expenses tracker

A Node.js server to keep track of expenses using [Express 4](http://expressjs.com/) and [MongoDB](https://www.mongodb.com/) using [Mongoose ODM](https://mongoosejs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
npm install
npm start
```

Your app should now be running on [localhost:4000](http://localhost:4000/).


## Running with Docker
Make sure you have [Docker](https://www.docker.com/) installed.

```sh
docker -t expenses-tracker .
docker run -dp 4000:4000 expenses-tracker
```

## Running with Docker-Compose
Make sure you have [Docker](https://www.docker.com/) and [Docker-Compose](https://docs.docker.com/compose/) installed.

```sh
docker-compose build
docker-compose up
```
