import React, {ReactDOM, Component, useState} from 'react';
import './App.css';
// import GoogleMapReact from 'google-map-react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const publicUrl = "https://amplified-ward-289301.wl.r.appspot.com/";
const localUrl = "http://localhost:8080/";

class RouteInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oCity: '',
            dCity: '',
            oAdd: '',
            dAdd: '',
            oState: '',
            dState: '',
            oZip: '',
            dZip: '',
            showErrText: "hidden",
            showMap: "hidden"
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });
        // console.log(this.state);
    };

    handleSubmit = (e) => {
        // console.log(this.state);
        let noError = true;
        Object.keys(this.state).map((item) => {
                if (("" + item) !== "showErrText") {
                    // console.log("current item", item);
                    if (this.state[item] === '') {
                        // console.log("error in", item);
                        this.setState({ showErrText : "show" });
                        noError = false;
                    }
                }
            });
        // console.log(this.state);
        if (noError) {
            console.log("here");
            this.setState({ showErrText : "hidden" });
            let originLoc = this.state.oAdd + " " + this.state.oCity + " " + this.state.oState +
                         " " + this.state.oZip;
            originLoc = encodeURIComponent(originLoc);

            let destLoc = this.state.dAdd + " " + this.state.dCity + " " + this.state.dState +
                       " " + this.state.dZip;
            destLoc = encodeURIComponent(destLoc);

            let vehicleOneMake = this.props.makes[this.props.vehicles.indexOf(this.props.vehicleOne)];
            let vehicleOneModel = this.props.models[this.props.vehicles.indexOf(this.props.vehicleOne)];
            let vehicleOneYear = this.props.years[this.props.vehicles.indexOf(this.props.vehicleOne)];
            let vehicleTwoMake = this.props.makes[this.props.vehicles.indexOf(this.props.vehicleTwo)];
            let vehicleTwoModel = this.props.models[this.props.vehicles.indexOf(this.props.vehicleTwo)];
            let vehicleTwoYear = this.props.years[this.props.vehicles.indexOf(this.props.vehicleTwo)];

            let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + originLoc +
                      "&destination=" + destLoc + "&key=sneaky";

            console.log('url', url);

            let params = new FormData();
            params.append("origin", originLoc);
            params.append("dest", destLoc);
            params.append("carOneMake", vehicleOneMake);
            params.append("carOneModel", vehicleOneModel);
            params.append("carOneYear", vehicleOneYear);
            params.append("carTwoMake", vehicleTwoMake);
            params.append("carTwoModel", vehicleTwoModel);
            params.append("carTwoYear", vehicleTwoYear);

            console.log("data exists:", params);

            fetch(publicUrl + "calculateEmissions",
            {
                method: 'POST',
                body: params
            })
                .then(this.checkStatus)
                .then(resp => resp.json())
                .then(data => this.handleData)
                .catch(console.error);
        }
    };

    handleData(data) {
        this.plotPoints(data.all_stops);
    }

    plotPoints(allStops) {
        this.setState({ showMap : "show"});
        // var usCenter = new google.maps.LatLng(39.8283, 98.5795);
    }

    checkStatus(response) {
        console.log("response!", response);
        if (response.ok) {
            return response;
        } else {
            throw Error('Error in request: ' + response.statusText);
        }
    }

    toggleErrTxt() {
        if (!this.state.showErrText) {
            return "hidden";
        }
    }

    render() {
        //refers to the dropdown for possible short building names so more information can be gathered
        const { showErrText } = this.state;
        const { showMap } = this.state;
        return (
            <div>
                <div
                    className = "route-input"
                >
                    <div
                        className = "route-origin"
                    >
                        <label htmlFor="oAdd">Address:</label>
                        <input type="text" id="oAdd" name="oAdd" value={this.state.firstName} onChange={this.onChange} />
                        <br />

                        &nbsp;&nbsp;&nbsp;

                        <label htmlFor="oCity">City:</label>
                        <input
                            type="text"
                            id="oCity"
                            name="oCity"
                            value={this.state.oCity}
                            onChange={this.onChange}
                        />
                        <br />

                        &nbsp;&nbsp;&nbsp;

                        <label htmlFor="oState">State (Abb.):</label>
                        <input
                            type="text"
                            id="oState"
                            name="oState"
                            pattern="[A-Z]{2}"
                            value={this.state.oState}
                            onChange={this.onChange}
                        />
                        <br />
                        &nbsp;&nbsp;&nbsp;

                        <label htmlFor="oZip">Zipcode:</label>
                        <input type="text" id="oZip" name="oZip" value={this.state.oZip} onChange={this.onChange} />
                        <br />

                    </div>

                    <div
                        className = "route-destination"
                    >
                            <label htmlFor="dAdd">Address:</label>
                            <input type="text" id="dAdd" name="dAdd" value={this.state.dAdd} onChange={this.onChange} />
                            <br />


                            <label htmlFor="dCity">City:</label>
                            <input type="text" id="dCity" name="dCity" value={this.state.dCity} onChange={this.onChange} />
                            <br />


                            <label htmlFor="dState">State (Abb.):</label>
                            <input
                                type="text"
                                id="dState"
                                name="dState"
                                pattern="[A-Z]{2}"
                                value={this.state.dState}
                                onChange={this.onChange}
                            />
                            <br />

                            &nbsp;&nbsp;&nbsp;

                            <label htmlFor="dZip">Zipcode:</label>
                            <input type="text" id="dZip" name="dZip" value={this.state.dZip} onChange={this.onChange} />
                            <br />
                    </div>
                </div>
                <button id="submit" onClick={this.handleSubmit}>Calculate Emissions on Route</button>
                <p id="error-txt" className={showErrText}>Looks like something has not been filled in properly!</p>
                {/*<MapComponent className={showMap}></MapComponent>*/}
            </div>
        );
    }
}


export class MapComponent extends Component {
    // Need to pass down params from fetch endpoint into this function and then fill in the content from there
    render() {
        const containerStyle = {
            width: '500px',
            height: '500px'
        };

        return (
            <div className="map-area">
                <Map
                    google={this.props.google}
                    style = {containerStyle}
                    zoom={14}
                    initialCenter={{
                        lat: 47.444,
                        lng: -122.176
                    }}
                >
                    <Marker key="marker_1"
                        position={{
                            lat: 47.444,
                            lng: -122.176
                        }}
                    />
                    <Marker key="marker_2"
                        position={{
                            lat: 47.444,
                            lng: -122.178
                        }}
                    />
                </Map>
            </div>
        );
    }
}
// export default GoogleApiWrapper({
// apiKey: ('AIzaSyBS0dJioYMOXRcWNmBeQJFSavGzPlheW2k')
// })(MapComponent);

 export default RouteInputs;
