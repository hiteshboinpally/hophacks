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
          makes:[],
          models:[],
          years:[],
          vehicleOne:"",
          vehicleTwo:"",
      }

  }

    componentDidMount() {
        this.makeRequestVehicles();
    }

    async makeRequestVehicles(){
        const vehiclesTemp = [];
        const makesTemp = [];
        const modelsTemp = [];
        const yearsTemp = [];
        const response = await fetch(publicUrl+"getCarList");
        const text = await response.json();
        for(let i = 500;i<2000;i++){
            const currentVeh = text[i];
            let vehicleToAdd = "";
            vehicleToAdd += currentVeh.make + " " + currentVeh.model + " " + currentVeh.year;
            vehiclesTemp[vehiclesTemp.length] = vehicleToAdd;
            makesTemp[makesTemp.length] = currentVeh.make;
            modelsTemp[modelsTemp.length] = currentVeh.model;
            yearsTemp[yearsTemp.length] = currentVeh.year;

        }
        this.setState({
            vehicles:vehiclesTemp,
            makes:makesTemp,
            models:modelsTemp,
            years:yearsTemp
        });
    }

    handleSelectVehicleOne= (selectedItem) => {
        this.setState({
            vehicleOne: selectedItem.value
        });
    };

    handleSelectVehicleTwo = (selectedItem) => {
        this.setState({
            vehicleTwo: selectedItem.value
        });
    };




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
          <CarInformation vehicles = {this.state.vehicles}
                          onGetVehicleOne = {this.handleSelectVehicleOne}
                          onGetVehicleTwo = {this.handleSelectVehicleTwo}/>
              <p>
              Now input your origin and destination addresses
              </p>
          <RouteInputs vehicleOne = {this.state.vehicleOne}
                       vehicleTwo = {this.state.vehicleTwo} vehicles = {this.state.vehicles} models = {this.state.models}
          makes = {this.state.makes} years = {this.state.years}/>
          </header>
        </div>
    );
  }
}

export default App;




