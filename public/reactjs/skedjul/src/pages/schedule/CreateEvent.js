import React, { Component } from "react";
import { createEvent } from '../../global_components/firebaseFuncs'

export default class CreateEvent extends Component {
  handleClick = () => {
    this.props.toggle();
  };

  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      name: '',
      startTime: 0,
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
    createEvent({
      data: {

      }
    })
    this.setState({
      duration: 0,
      name: '',
      startTime: 0,
    })

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
          <input name="startTime" type="time" value={this.state.duration} onChange={this.handleChange}/>
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