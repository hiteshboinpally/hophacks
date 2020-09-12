import React, {ReactDOM, Component} from 'react';
import './App.css';

class RouteInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                oCity: '',
                dCity: '',
                oAdd: '',
                dAdd: '',
                oState: '',
                dState: '',
                oZip: '',
                dZip: ''
            }
        };

        this.errText = React.createRef();
    }

    onChange = (e) => {
        let input = e.target.name;
        // this.setState({ [.input] : e.target.value });
        console.log(this.state);
    }

    handleSubmit = (e) => {
        console.log(this.state);
        Object.keys(this.state).map((item) => {
            if (this.state[item] == '') {
                console.log(this.errText);
                this.errText.classList.remove('hidden');
                return;
            }
        });
        let origin = "";
        let dest = "";
    }

    id(elemId) {
        return ReactDOM.getElementById(elemId);
    }

    render() {
        //refers to the dropdown for possible short building names so more information can be gathered
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
                <p id="error-txt" className={this.state.errText}>Looks like something has not been filld in properly!</p>
            </div>
        );
    }
}

export default RouteInputs;
