import React, { Component } from "react";
import { createEvent } from '../../global_components/firebaseFuncs'
import TimePicker from 'react-time-picker';

export default class CreateEvent extends Component {
  handleClick = () => {
    this.props.toggle();
  };

  constructor(props) {
    super(props);
    this.state = {
      duration: '',
      name: '',
      hours: '',
      minutes: '',
      time: ''
    };

    this.handleChange= this.handleChange.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    let h = parseInt(this.state.hours);
    console.log(h);
    let m = parseInt(this.state.minutes);
    console.log(m);
    let t = parseInt(this.state.time);
    console.log(t);

    if (h === 12 && t) h = 0;
    console.log(h);
    if (h !== 12 && !t) h += 12;
    console.log(h);

    createEvent({
      name: this.state.name,
      duration: this.state.duration,
      startTime: h * 60 + m
    });
    this.setState({
      duration: '',
      name: '',
      hours: '',
      minutes: '',
      time: '',
    });

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input name="name" type="text" value={this.state.name} onChange={this.handleChange}/>
        </label>
        <label>
          Time:
          <input name="hours" type="number" min="1" max="12" value={this.state.hours} onChange={this.handleChange}/>
          <input name="minutes" type="number" min="0" max="60" value={this.state.minutes} onChange={this.handleChange}/>
          <select name="time" value={this.state.time} onChange={this.handleChange}>
            <option value='0'>AM</option>
            <option value='1'>PM</option>
          </select>
        </label>
        <label>
          Duration:
          <input name="duration" type="number" value={this.state.duration} onChange={this.handleChange}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}