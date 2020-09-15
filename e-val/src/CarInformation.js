import React, {Component} from 'react';
import Select from "react-select";
import './App.css';

const publicUrl = "https://amplified-ward-289301.wl.r.appspot.com/";
const localUrl = "http://localhost:8080/";
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
                        options = {this.props.vehicles.map(t=>({value: t, label: t}))}
                        id = "vehicle1"
                        placeholder = "Select Vehicle #1"
                        onChange = {this.props.onGetVehicleOne}
                    />
                </p>
                <p align = "center">
                    <Select
                        options = {this.props.vehicles.map(t=>({value: t, label: t}))}
                        id = "vehicle2"
                        placeholder = "Select Vehicle #2"
                        onChange = {this.props.onGetVehicleTwo}
                    />
                </p>
            </div>
        );
    }
}

export default CarInformation;
