

'use strict';

const multer = require('multer');
const express = require('express');
const mysql = require('promise-mysql');
const fetch = require('node-fetch');
const geo = require('spherical-geometry-js');

const app = express();
app.use(multer().none());
app.use(express.static('public'));

app.set('view engine', 'pug');
app.enable('trust proxy');

const SERVER_ERR_MSG = "Something went wrong with the Server. Please try again soon!"


const createUnixSocketPool = async (config) => {
    const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";

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


let pool;
const poolPromise = mysql.createPool()
  .then((pool) => pool)
  .catch((err) => {
    console.log(err.stack);
    process.exit(1)
  });

app.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
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

app.post('/calculateEmissions', async (req, res) => {
    try {
        const route = await findRoute(req.body.origin, req.body.dest);
        const stepDistances = [];
        const stepStart = [];
        const stepEnd = [];
        const steps = route.routes[0].legs[0].steps;

        for(let i = 0; i<steps.length; i++){
            const step = steps[i];
            stepDistances[i] = step.distance.text;
            stepStart[i] = step.start_location;
            stepEnd[i] = step.end_location;
        }
        determineFuelingCoordinates(stepDistances, stepStart, stepEnd);
        res.status(200).json(steps);
    } catch(err) {
        res.status(500).send(SERVER_ERR_MSG);
    }
});



async function findRoute(){
    const response = await fetch("https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&units=metric&key=AIzaSyBS0dJioYMOXRcWNmBeQJFSavGzPlheW2k");
    return response.json();
}



async function determineFuelingCoordinates(stepDistances, stepStart, stepEnd) {
    const refillDist = 36960; //testing  with 7 miles as point to refuel (measured right now in ft -- smallest unit on maps for distance)
    let distanceWithoutFuel = 0;
    let refillPlaces = [];
    for (let i = 0; i < stepDistances.length; i++) {
        if (stepDistances[i].substring(stepDistances[i].length - 2, stepDistances[i].length) === "km") {
            let distance = parseFloat(stepDistances[i].substring(0, stepDistances[i].length - 2));
            stepDistances[i] = (1000 * distance);

        } else {
            stepDistances[i] = parseFloat(stepDistances[i].substring(0, stepDistances[i].length - 2));
        }
        if (distanceWithoutFuel + stepDistances[i] >= refillDist) {
            const heading = geo.computeHeading(stepStart[i], stepEnd[i]);
            const fillPosition = geo.computeOffset(stepStart[i], refillDist - distanceWithoutFuel, heading);
            const nearestStations = await findNearestGasStation(fillPosition);
            refillPlaces[refillPlaces.length] = nearestStations[0].geometry.location;
            distanceWithoutFuel = 0;
        }
        distanceWithoutFuel += stepDistances[i];
        return refillPlaces;
    }
}


    async function findNearestGasStation(fillPosition) {
        const response = await fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + fillPosition + "&radius=1500&type=restaurant&rankby=distance&keyword=cruise&key=AIzaSyBS0dJioYMOXRcWNmBeQJFSavGzPlheW2k");
        return response.json();
    }

    function electricFindNearestCharging() {

    }

    function gasFindNearestCharging() {

    }




// Listen to the App Engine-specified port, or 8080 otherwise
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        // console.log(connection);
        console.log(`Server listening on port ${PORT}...`);
    });
    