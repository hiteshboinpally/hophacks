import React, {Component} from 'react';
import './App.css';

class RouteInputs extends Component {
    render() {
        //refers to the dropdown for possible short building names so more information can be gathered
        return (
            <div
            >
            <div
                className = "route-input"
            >
                <div
                    className = "route-origin"
                >
                    <label htmlFor="oAdd">Address:</label>
                    <input type="text" id="oAdd" name="oAdd"></input><br></br>

                    <label htmlFor="oCity">City:</label>
                    <input type="text" id="oCity" name="oCity"></input><br></br>

                    <label htmlFor="oState">State:</label>
                    <input type="text" id="oState" name="oState"></input><br></br>

                    <label htmlFor="oZip">Zipcode:</label>
                    <input type="text" id="oZip" name="oZip"></input><br></br>

                </div>

                <div
                    className = "route-destination"
                >
                        <label htmlFor="dAdd">Address:</label>
                        <input type="text" id="dAdd" name="dAdd"></input><br></br>

                        <label htmlFor="dCity">City:</label>
                        <input type="text" id="dCity" name="dCity"></input><br></br>

                        <label htmlFor="dState">State:</label>
                        <input type="text" id="dState" name="dState"></input><br></br>

                        <label htmlFor="dZip">Zipcode:</label>
                        <input type="text" id="dZip" name="dZip"></input><br></br>
                </div>
            </div>
                <input type="submit" value="Find Route"></input><br></br>
            </div>
        );
    }
}

export default RouteInputs;
