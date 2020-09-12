import React, {Component} from 'react';
import logo from './logo.svg';
import Select from "react-select";
import './App.css';

class CarInformation extends Component {
    render() {
        //refers to the dropdown for possible short building names so more information can be gathered
        return (
            <div
                className = "vehicle-drop"
                // style = {{
                //     width: 250,
                // }}
            >
                <p align = "center">
                    <Select
                        id = "vehicle1"
                        placeholder = "Select Vehicle #1"
                        value = {this.props.valueBuild}
                        onChange = {this.props.onGetInfo}
                    />
                </p>
                <p align = "center">
                    <Select
                        id = "vehicle2"
                        placeholder = "Select Vehicle #2"
                        value = {this.props.valueBuild}
                        onChange = {this.props.onGetInfo}
                    />
                </p>
            </div>
        );
    }
}

export default CarInformation;
