import React, {Component} from 'react';
import './App.css';
import CarInformation from "./CarInformation";
import RouteInputs from "./RouteInputs";

const publicUrl = "https://amplified-ward-289301.wl.r.appspot.com/";
const localUrl = "http://localhost:8080/";
class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
          vehicles: [],
      }

  }

    componentDidMount() {
        this.makeRequestVehicles();
    }

    async makeRequestVehicles(){
        const vehiclesTemp = [];
        const response = await fetch(publicUrl+"getCarList");
        const text = await response.json();
        for(let i = 0;i<10;i++){
            const currentVeh = text[i];
            console.log(currentVeh);
            let vehicleToAdd = "";
            vehicleToAdd += currentVeh.make + " " + currentVeh.model + " " + currentVeh.year;
            vehiclesTemp[vehiclesTemp.length] = vehicleToAdd;
        }
        this.setState({
            vehicles:vehiclesTemp,
        });
    }


    render(){

      return (
        <div className="App">
          <div>
            <h1>
              EV-GAS
            </h1>
          </div>
          <link href="https://fonts.googleapis.com/css?family=Be+Vietnam|Nunito|Quicksand&display=swap"
                rel="stylesheet"/>
          <header className="App-header">
            <p>
              Please choose the make and model type of two cars you wish to compare.
            </p>
          <CarInformation vehicles = {this.state.vehicles}/>
              <p>
              Now input your origin and destination addresses
              </p>
          <RouteInputs/>
          </header>
        </div>
    );
  }
}

export default App;




