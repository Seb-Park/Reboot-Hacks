import React, { Component } from 'react';
import { getSchedule } from '../../global_components/firebaseFuncs'
class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] }
    }

    componentDidMount() {
        getSchedule()
            .then((result) => {
                this.setState({ data: result.data });
                console.log(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                <p>{this.state.data.duration}</p>
            </div>
        );
    }
}

export default Schedule;