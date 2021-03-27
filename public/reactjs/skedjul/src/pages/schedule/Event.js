import React, { Component } from "react";

export default class Event extends Component {
  constructor(props) {
    super(props);

    let data = props.data;

    let hours = parseInt(data.startTime / 60);
    let minutes = data.startTime - hours * 60;
    let suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours >= 12 ? hours - 12 : hours;

    if (hours === 0) hours = 12;
    if (minutes === 0) minutes = '00'

    this.startTime = `${hours}:${minutes} ${suffix}`;

    let d_hours = parseInt(data.duration / 60);
    let d_minutes = data.duration - d_hours * 60;

    let d_hours_str = '';
    let d_minutes_str = '';

    switch (d_hours) {
      case 0:
        break;
      case 1:
        d_hours_str = '1 hour';
        break;
      default:
        d_hours_str = `${d_hours} hours`;
    }

    switch (d_minutes) {
      case 0:
        break;
      case 1:
        d_minutes_str = ' 1 minute';
        break;
      default:
        d_minutes_str = ` ${d_minutes} minutes`;
    }

    this.duration = d_hours_str + d_minutes_str;
    this.name = data.name;
    console.log(data)
    console.log(this.startTime)
    console.log(this.duration)
    console.log(this.name)
  }
  render() {
    return (
      <div className="event-block">
        <div className="event-left">
          <p>{this.name} Homework</p>
          <p>This is going to take you {this.duration}.</p>
        </div>
        <p className="start-time">{this.startTime}</p>
      </div>

    );
  }
}