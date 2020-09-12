import React, {Component} from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';

class RouteInputs extends Component {
    render() {
        //refers to the dropdown for possible short building names so more information can be gathered
        return (
            <div
                className = "vehicle-drop"
            >
                <p align = "center">
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </p>
            </div>
        );
    }
}

export default RouteInputs;
