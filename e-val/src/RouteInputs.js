import React, {ReactDOM, Component} from 'react';
import './App.css';

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
            showErrText: "hidden"
        };

        this.errText = React.createRef();
    }

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });
        // console.log(this.state);
    }

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
            let origin = this.state.oAdd + " " + this.state.oCity + " " + this.state.oState +
                         " " + this.state.oZip;
            console.log("origin", origin);
            origin = encodeURIComponent(origin);
            console.log("encoded origin", origin);

            let dest = this.state.dAdd + " " + this.state.dCity + " " + this.state.dState +
                       " " + this.state.dZip;
            console.log("dest", dest);
            dest = encodeURIComponent(dest);
            console.log("encoded dest", dest);

            let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin +
                      "&destination=" + dest + "&key=sneaky"

            console.log('url', url);
            let finalResult = "broken";

            fetch(localUrl + "calculateEmissions")
                .then(resp => resp.json())
                .then((data) => {
                    console.log(data);
                })
                .catch(err => console.log(err))

            console.log(finalResult);
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

                        <label htmlFor="oCity">City:</label>
                        <input
                            type="text"
                            id="oCity"
                            name="oCity"
                            value={this.state.firstName}
                            onChange={this.onChange}
                        />
                        <br />

                        <label htmlFor="oState">State:</label>
                        <input
                            type="text"
                            id="oState"
                            name="oState"
                            pattern="[A-Z]{2}"
                            value={this.state.firstName}
                            onChange={this.onChange}
                        />
                        <br />

                        <label htmlFor="oZip">Zipcode:</label>
                        <input type="text" id="oZip" name="oZip" value={this.state.firstName} onChange={this.onChange} />
                        <br />

                    </div>

                    <div
                        className = "route-destination"
                    >
                            <label htmlFor="dAdd">Address:</label>
                            <input type="text" id="dAdd" name="dAdd" value={this.state.firstName} onChange={this.onChange} />
                            <br />

                            <label htmlFor="dCity">City:</label>
                            <input type="text" id="dCity" name="dCity" value={this.state.firstName} onChange={this.onChange} />
                            <br />

                            <label htmlFor="dState">State:</label>
                            <input
                                type="text"
                                id="dState"
                                name="dState"
                                pattern="[A-Z]{2}"
                                value={this.state.firstName}
                                onChange={this.onChange}
                            />
                            <br />

                            <label htmlFor="dZip">Zipcode:</label>
                            <input type="text" id="dZip" name="dZip" value={this.state.firstName} onChange={this.onChange} />
                            <br />
                    </div>
                </div>
                <button id="submit" onClick={this.handleSubmit}>Find Route</button>
                <p id="error-txt" className={showErrText}>Looks like something has not been filld in properly!</p>
            </div>
        );
    }
}

export default RouteInputs;
