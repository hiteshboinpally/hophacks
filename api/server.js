
'use strict';

const express = require('express');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'pug');
app.enable('trust proxy');

// Automatically parse request body as form data.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const SERVER_ERR_MSG = "Something went wrong with the Server. Please try again soon!"

// [START cloud_sql_mysql_mysql_create_tcp]
const createTcpPool = async (config) => {
  // Extract host and port from socket address
  const dbSocketAddr = process.env.DB_HOST.split(":")
  console.log("line22", dbSocketAddr);

  // Establish a connection to the database
  return await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    host: dbSocketAddr[0], // e.g. '127.0.0.1'
    port: dbSocketAddr[1], // e.g. '3306'
    // ... Specify additional properties here.
    ...config
  });
}
// [END cloud_sql_mysql_mysql_create_tcp]

// [START cloud_sql_mysql_mysql_create_socket]
const createUnixSocketPool = async (config) => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql"

  // Establish a connection to the database
  return await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // Specify additional properties here.
    ...config
  });
}
// [END cloud_sql_mysql_mysql_create_socket]

const createPool = async () => {
  const config = {
    // [START cloud_sql_mysql_mysql_limit]
    // 'connectionLimit' is the maximum number of connections the pool is allowed
    // to keep at once.
    connectionLimit: 5,
    // [END cloud_sql_mysql_mysql_limit]

    // [START cloud_sql_mysql_mysql_timeout]
    // 'connectTimeout' is the maximum number of milliseconds before a timeout
    // occurs during the initial connection to the database.
    connectTimeout: 10000, // 10 seconds
    // 'acquireTimeout' is the maximum number of milliseconds to wait when
    // checking out a connection from the pool before a timeout error occurs.
    acquireTimeout: 10000, // 10 seconds
    // 'waitForConnections' determines the pool's action when no connections are
    // free. If true, the request will queued and a connection will be presented
    // when ready. If false, the pool will call back with an error.
    waitForConnections: true, // Default: true
    // 'queueLimit' is the maximum number of requests for connections the pool
    // will queue at once before returning an error. If 0, there is no limit.
    queueLimit: 0, // Default: 0
    // [END cloud_sql_mysql_mysql_timeout]

    // [START cloud_sql_mysql_mysql_backoff]
    // The mysql module automatically uses exponential delays between failed
    // connection attempts.
    // [END cloud_sql_mysql_mysql_backoff]
  }
  if (process.env.DB_HOST) {
    return await createTcpPool(config);
  } else {
    return await createUnixSocketPool(config);
  }
    
};
// [END cloud_sql_mysql_mysql_create]

let pool;
const poolPromise = createPool()
  .then((pool) => pool)
  .catch((err) => {
    console.log(err.stack);
    process.exit(1)
  });

app.use(async (req, res, next) => {
  if (pool) {
    return next();
  }
  try {
    pool = await poolPromise;
    next();
  }
  catch (err) {
    console.log(err.stack);
    return next(err);
  }
});

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/addNum', async (req, res) => {
    const randInt = Math.floor(Math.random() * Math.floor(100));
    try {
        // pool.query(
        //   "INSERT INTO randNums VALUES(" + randInt + ")",
        //   function(error, results, fields) {
        //     if (error) throw error;
        //     res.status(200).send("Successfully added a number!");
        //   }
        // );
        const stmt = 'INSERT INTO randNums(randNum) VALUES (?)';
        await pool.query(stmt, randInt);
    } catch(err) {
        console.log(err.stack);
        res.status(500).send(SERVER_ERR_MSG);
    }
    let resp = "Added the number: " + randInt;
    res.status(200).send(resp);
});

app.get('/getAllNums', async (req, res) => {
    try {
        const allNums =  await pool.query("SELECT * FROM `randNums`");
        console.log("all Numbers!");
        console.log(allNums);
        res.status(200).json(allNums);
    } catch(err) {
        console.log(err.stack);
        res.status(500).send(SERVER_ERR_MSG);
    }
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    // console.log(connection);
  console.log(`Server listening on port ${PORT}...`);
});