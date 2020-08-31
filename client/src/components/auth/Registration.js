import React, { Component } from "react";
import axios from "axios";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      registrationErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const { email, password, firstName, lastName } = this.state;

    axios
      .post(
        "/signup",
        {
          email: email,
          password: password,
          firstName,
          lastName
        }, {
          withCredentials: true
        }
      )
      .then(response => {
        if (response.data.token) {
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch(error => {
        console.log("registration error", error);
        this.setState({registrationErrors: error.response.data.error});
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        {
          this.state.registrationErrors && 
          <span className="errorMessage">{this.state.registrationErrors.toUpperCase()}</span>
        }
        <form onSubmit={this.handleSubmit}>
        <div className="email">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="firstName">
        <label htmlFor="firstName">First Name</label>
          <input
            type="firstName"
            name="firstName"
            placeholder="First Name"
            value={this.state.firstName}
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="lastName">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="lastName"
            name="lastName"
            placeholder="Last Name"
            value={this.state.lastName}
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="createAccount">
              <button type="submit">Create Account</button>
              <small>Already Have an Account?</small>
        </div>
        </form>
      </div>
    );
  }
}