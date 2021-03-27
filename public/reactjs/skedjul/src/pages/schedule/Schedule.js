import React, { Component } from 'react';
import { createEvent, getEvents } from '../../global_components/firebaseFuncs'
import { Redirect, useHistory } from "react-router";

import Event from './Event'
import CreateEvent from './CreateEvent'
class Schedule extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [], createEventPopup: false }
    }

    toggleCreateEvent = () => {
        this.setState({
            createEventPopup: !this.state.createEventPopup
        });
    };

    componentDidMount() {
        getEvents()
            .then((result) => {
                this.setState({ 
                    data: {
                        events: result.data.events
                    } 
                });
                console.log(result.data.events)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        if (this.state.data.events == null) return null;
        const events = [];
        this.state.data.events.forEach(event => {
            events.push(<Event data={event}/>)
        });
        events.push()
        return (
            <div>
                <div>
                    {events}
                </div>
                <button onClick={this.toggleCreateEvent}>
                    Create event
                </button>
                {this.state.createEventPopup ? <CreateEvent toggle={this.toggleCreateEvent} /> : null}
            </div>
            

        );
    }
}

export default Schedule;