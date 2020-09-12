import React, {Component} from 'react';
import './App.css';
import CarInformation from "./CarInformation";
import RouteInputs from "./RouteInputs";

class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (

        <div className="App">
          <div className="top">
            <h1>
              Vehicle Finder
            </h1>
          </div>
          <link href="https://fonts.googleapis.com/css?family=Be+Vietnam|Nunito|Quicksand&display=swap"
                rel="stylesheet"/>
          <header className="App-header">
            <p>
              Please choose the make and model type of two cars you wish to compare.
            </p>
          <CarInformation/>
              <p>
              Now input your origin and destination addresses.
              </p>
          <RouteInputs/>
          </header>
        </div>
    );
  }
}

export default App;




