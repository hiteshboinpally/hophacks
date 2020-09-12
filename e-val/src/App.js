import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import CarInformation from "./CarInformation";

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
              Please choose the make and model type of your car along with your origin and
              destination point.
            </p>
          <CarInformation/>
          </header>
        </div>
    );
  }
}

export default App;




