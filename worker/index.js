/**
What worker does is watching redis anytime is a new index been inserted
into redis, it will calculate fib number for the index. Then insert 
it back to redis. 
*/

const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

//subscribtion
const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}


sub.on('message', (channel, message) => {
    console.log('work message = ' + message);
    // Redis HSET command is used to set field in the hash stored at the key to value.
    // If the key does not exist, a new key holding a hash is created. 
    // If the field already exists in the hash, it is overwritten.
    redisClient.hset('values', message, fib(parseInt(message)));
    console.log(redisClient.hgetall('values'))
})

//listen to any insert event for redisClient
sub.subscribe('insert');
