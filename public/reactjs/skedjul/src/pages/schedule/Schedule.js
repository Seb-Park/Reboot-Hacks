import React, { Component } from 'react';
import { createEvent, getCurrentScheduleCallable } from '../../global_components/firebaseFuncs'
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
        getCurrentScheduleCallable()
            .then((result) => {
                console.log(result.data)
                this.setState({ 
                    data: {
                        events: result.data.periods
                    } 
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        if (this.state.data.events == null) {
            console.log("null")
            return null;
        }
        const events = [];
        let counter = 0;
        this.state.data.events.forEach(event => {
            events.push(<Event data={event} key={counter}/>)
            counter++;
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