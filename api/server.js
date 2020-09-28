


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
};

'use strict';


const express = require('express');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const multer = require('multer');
const geo = require('spherical-geometry-js');


const app = express();
//app.set('view engine', 'pug');
//app.enable('trust proxy');
app.use(multer().none());

// Automatically parse request body as form data.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const SERVER_ERR_MSG = "Something went wrong with the Server. Please try again soon!"

/*

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
*/
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
  /*
  if (process.env.DB_HOST) {
    return await createTcpPool(config);
  } else {*/
    return await createUnixSocketPool(config);
  //}

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

app.get('/getCarList', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        const allCars = await pool.query("SELECT make, model, year FROM `vehicles`");
        console.log(allCars);
        res.status(200).json(allCars);
    } catch(err) {
        console.log(err.stack);
        res.status(500).send(SERVER_ERR_MSG);
    }
});

app.post('/calculateEmissions', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        // console.log(req);
        const route = await findRoute(req.body.origin, req.body.dest);
        let stepDistances = [];
        let stepStart = [];
        let stepEnd = [];
        const steps = route.routes[0].legs[0].steps;
        const vehicleOne = req.body.carOne;
        const vehicleTwo = req.body.carTwo;

        for(let i = 0; i<steps.length; i++){
            const step = steps[i];
            stepDistances.push(step.distance.text);
            stepStart.push(step.start_location);
            stepEnd.push(step.end_location);
        }
        // res.status(200).json({"ay": "what's wrong"});
        // let result = ;
        // console.log("result", result);
        res.status(200).json(await determineFuelingCoordinates(stepDistances, stepStart, stepEnd));
    } catch(err) {
        console.log(err);
        res.status(500).send(SERVER_ERR_MSG);
    }
});



async function findRoute(origin, destination){
    const response = await fetch("https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&units=metric&key=AIzaSyBS0dJioYMOXRcWNmBeQJFSavGzPlheW2k");
    return response.json();
}



async function determineFuelingCoordinates(stepDistances, stepStart, stepEnd) {
    console.log("starting determinations");
    const refillDist = 30000; //testing  with 7 miles as point to refuel (measured right now in m -- smallest unit on maps for distance)
    let milesUntilRefill = refillDist;
    let refillPlaces = [];
    let allStops = [];
    for (let i = 0; i < stepDistances.length; i++) {
        // Standardize Units
        if (stepDistances[i].substring(stepDistances[i].length - 2, stepDistances[i].length) === "km") {
            let distance = parseFloat(stepDistances[i].substring(0, stepDistances[i].length - 2));
            stepDistances[i] = (1000 * distance);
        } else {
            stepDistances[i] = parseFloat(stepDistances[i].substring(0, stepDistances[i].length - 2));
        }

        let start = new geo.LatLng(stepStart[i].lat, stepStart[i].lng);
        let end = new geo.LatLng(stepEnd[i].lat, stepEnd[i].lng);
        let distanceBetween = geo.computeDistanceBetween(start, end);
        // console.log("Miles until Refill", milesUntilRefill);
        // console.log("STEP START", stepStart[i]);
        // console.log("STEP END", stepEnd[i]);
        // console.log("STEP DISTANCES", distanceBetween);
        allStops.push({"lat": start.latitude, "lng": start.longitude});
        if (milesUntilRefill < distanceBetween) {
            const refillTimes = Math.floor(distanceBetween/milesUntilRefill);
            let heading = geo.computeHeading(start, end);
            for(let j = 0;j < refillTimes; j++){
                // console.log("Loop iteration " + j + ": ");
                // console.log("until refill: " + milesUntilRefill);
                // console.log("heading:" + heading);
                //  console.log(start.latitude +",", start.longitude);
                //  console.log(end.latitude +",", end.longitude);
                // console.log("\n");
                let fillPosition = geo.computeOffset(start, milesUntilRefill, heading);
                milesUntilRefill = refillDist;
                start = fillPosition;
                let nearestStation = await findNearestElectricStation(fillPosition);
                refillPlaces.push(nearestStation)
                allStops.push({"lat": fillPosition.latitude, "lng": fillPosition.longitude});
            }
            milesUntilRefill -= (distanceBetween%milesUntilRefill);
        }
        else {
            milesUntilRefill -= distanceBetween;
        }
        allStops.push({"lat": end.latitude, "lng": end.longitude});
    }
    // console.log(refillPlaces);
    // console.log(allStops);
    console.log("finished determinations");
    return {"refill_places": refillPlaces, "all_stops": allStops};
}


    async function findNearestElectricStation(fillPosition) {
        const keyword = "electric charging station";
        let response = await fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ fillPosition.lat() + "," + fillPosition.lng() +"&keyword=" + keyword + "&rankby=distance&key=AIzaSyBS0dJioYMOXRcWNmBeQJFSavGzPlheW2k");
        response = await response.json();
        let coord = 0;
        if (response.status !== "ZERO_RESULTS") {
          coord = response.results[0].geometry.location;
          let lat = coord.lat;
          let lng = coord.lng;
          let response_two = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+ lat + "," + lng +"&key=AIzaSyBS0dJioYMOXRcWNmBeQJFSavGzPlheW2k");
          response_two = await response_two.json();
          const address = response_two.results[0].formatted_address;
          // console.log("Address: " + address);
          return address.substring(address.length - 10, address.length - 5);
        } else {
          return "No nearby adress no idea what to do lol fml";
        }
    }



// Listen to the App Engine-specified port, or 8080 otherwise
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        // console.log(connection);
        console.log(`Server listening on port ${PORT}...`);
    });
