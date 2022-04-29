import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import "../styles/updatePassword.css";

class UpdatePassword extends Component {
  constructor() {
    super();
    this.state = {
      userPassword: undefined,
      userConfirmPassword: undefined,
      token: undefined,
      isPasswordUpdated: false,
    };
  }

  componentDidMount() {
    const querystring = queryString.parse(this.props.location.search);
    const { token } = querystring;
    this.setState({ token: token });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleUpdatePassword = () => {
    const { userPassword, userConfirmPassword, token } = this.state;
    if (userPassword === userConfirmPassword) {
      const reqObj = {
        userPassword,
        token,
      };

      axios({
        url: "http://localhost:5001/reset-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: reqObj,
      })
        .then((response) => {
          alert(response.data.message);
          this.setState({
            userPassword: undefined,
            userConfirmPassword: undefined,
            token: undefined,
            isPasswordUpdated: true,
          });
        })
        .catch();
    } else {
      alert("Password mismatched");
    }
  };

  redirectToHome = () => {
    this.props.history.push("/");
  };

  render() {
    const { userPassword, userConfirmPassword, isPasswordUpdated } = this.state;
    return (
      <div className="update-password-form row">
        {!isPasswordUpdated ? (
          <form>
            <div className="row">
              <label
                htmlFor="userPassword"
                className="label-update-password col-3"
              >
                New Password
              </label>
              <input
                required={true}
                name="userPassword"
                type="password"
                value={userPassword}
                className="input-update-password col-8"
                onChange={this.handleInputChange}
                placeholder="Create new password"
              />
            </div>

            <div className="row">
              <label
                htmlFor="userConfirmPassword"
                className="label-update-password col-3"
              >
                Confirm Password
              </label>
              <input
                required={true}
                name="userConfirmPassword"
                type="password"
                value={userConfirmPassword}
                className="input-update-password col-8"
                onChange={this.handleInputChange}
                placeholder="Type password again"
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                className="button-update-password btn btn-dark"
                onClick={this.handleUpdatePassword}
              >
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div>
              <h5 style={{ textAlign: "center" }}>
                Click this button to go to Home page
              </h5>
              <div style={{ textAlign: "center" }}>
                <button onClick={this.redirectToHome} className="btn btn-dark">
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UpdatePassword;
