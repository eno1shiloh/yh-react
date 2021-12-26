/*
The (express) server app will connect to postgres to save any seen index. 
Also, calls redis for value of and index.
*/
const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//PG === Postgres
const { pool } = require('pg');
const pgClient = new pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () =>
    console.log('Lost PG Connection')
);

pgClient.on('error', () => console.log('Lost Postgres connection'));

//Create table if not exist. 
pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

// Redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
//Read node js redis library for reason of duplicate();
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
    res.send("Hi");
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40)
        return res.status(422).send('Index too high');

    redisClient.hset('values', index, 'Nothing yet');
    redisPublisher.publish('insert', index);

    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({ working: true });
})

//app listen to port 5000
app.listen(5000, err => {
    console.log('Listening');
})