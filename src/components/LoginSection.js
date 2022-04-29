import React, { Component } from "react";
import "../styles/filter.css";
import "../styles/pageHeader.css";
import Modal from "react-modal";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { withRouter } from "react-router-dom";

const customStylesLogin = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "solid 2px darkgrey",
    borderRadius: "1rem",
  },
};

class LoginSection extends Component {
  handleNavigateUser = () => {
    this.props.history.push("/user");
  };

  constructor(props) {
    super(props);
    this.state = {
      loginModalIsOpen: false,
      createAccountModalIsOpen: false,
      loginMessage: undefined,
      userName: "",
      userEmail: "",
      userPhone: undefined,
      userAddress: "",
      userPassword: "",
      userConfirmPassword: "",
      forgetPasswordModalIsOpen: false,
      errorResponse: "",
    };
  }

  handleCloseModal = (state, value) => {
    this.setState({ [state]: value });
  };

  handleLogin = () => {
    this.setState({
      loginModalIsOpen: true,
      createAccountModalIsOpen: false,
      errorResponse: "",
    });
  };

  responseGoogle = (response) => {
    console.log(response);
    localStorage.setItem("loggedInUserName", response.profileObj.name);
    localStorage.setItem("loggedInUserEmail", response.profileObj.email);
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("loggedInWith", "google");
    this.setState({ loginModalIsOpen: false });
  };

  handleLogout = () => {
    localStorage.clear();
    if (this.props.location.pathname === "/user") {
      this.props.history.push("/");
    }
    this.setState({});
  };

  handleCreateAccount = () => {
    this.setState({ createAccountModalIsOpen: true, loginModalIsOpen: false });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  createAccount = (event) => {
    event.preventDefault();
    const {
      userName,
      userEmail,
      userPhone,
      userAddress,
      userPassword,
      userConfirmPassword,
    } = this.state;
    if (userPassword === userConfirmPassword) {
      const reqObj = {
        userName,
        userEmail,
        userPhone,
        userAddress,
        userPassword,
      };
      axios({
        url: "http://localhost:5001/signup",
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        data: reqObj,
      })
        .then((response) => {
          alert(response.data.message);
          this.setState({
            userName: "",
            userEmail: "",
            userPhone: undefined,
            userAddress: "",
            userPassword: "",
            userConfirmPassword: "",
          });
        })
        .catch();
      this.handleCloseModal("createAccountModalIsOpen", false);
    } else {
      alert("Paswword mismatched");
    }
  };

  handleLoginAPI = (event) => {
    event.preventDefault();
    const { userEmail, userPassword } = this.state;
    const reqObj = {
      userEmail,
      userPassword,
    };
    axios({
      url: "http://localhost:5001/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: reqObj,
    })
      .then((response) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("loggedInUserName", response.data.userName);
        localStorage.setItem("loggedInUserEmail", userEmail);
        // setTimeout(function(){alert(response.data.message)},3000);
        this.setState({
          loginModalIsOpen: false,
          loginMessage: response.data.message,
          errorResponse: "",
        });
      })
      .catch((err) => {
        if (err.response) {
          this.setState({ errorResponse: err.response.data.message });
        }
      });
  };

  handleForgetPassword = () => {
    this.setState({ forgetPasswordModalIsOpen: true, loginModalIsOpen: false });
  };

  handleResetPassword = () => {
    const { userEmail } = this.state;
    const reqObj = { userEmail };
    axios({
      url: "http://localhost:5001/forget-password",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: reqObj,
    })
      .then((response) => alert(response.data.message))
      .catch();
    this.setState({ forgetPasswordModalIsOpen: false });
  };

  render() {
    const {
      loginModalIsOpen,
      createAccountModalIsOpen,
      forgetPasswordModalIsOpen,
      userName,
      userEmail,
      userPhone,
      userAddress,
      userPassword,
      userConfirmPassword,
      errorResponse,
    } = this.state;
    let loggedInUserName = localStorage.getItem("loggedInUserName");
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let loggedInWith = localStorage.getItem("loggedInWith");
    return (
      <div className="login-section-pageHeader">
        {/* <nav className="navbar navbar-expand-md navbar-light login-menu-sm">
          <div className="collapse navbar-collapse" id="login-menu"> */}
        {/* {isLoggedIn ? (
          loggedInWith !== "google" ? (
            <ul>
              <li>
                <div className="dropdown logged-user-dropdown-home">
                  <button
                    className=" btn"
                    type="button"
                    id="logged-user-dropdown"
                    data-bs-toggle="dropdown"
                  >
                    <h6 className="logged-user-name">{loggedInUserName}</h6>
                    <i className="fa fa-chevron-down user-name-down-arrow" />
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="logged-user-dropdown"
                  >
                    <button
                      className="logged-user-dropdown-menu"
                      onClick={this.handleNavigateUser}
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </li>
              <li>
                <button
                  className="nav-link logout-button"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <div className="logged-user-dropdown">
                  <h6 className="logged-user-name">{loggedInUserName}</h6>
                </div>
              </li>
              <li>
                <button
                  className="nav-link logout-button"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )
        ) : (
          <ul>
            <li>
              <button
                className="btn btn-light btn-md login-home"
                onClick={this.handleLogin}
              >
                Login
              </button>
            </li>
            <li>
              <button
                className="btn btn-light btn-md create-account-home"
                onClick={this.handleCreateAccount}
              >
                Create an account
              </button>
            </li>
          </ul>
        )} */}
        {/* </div>
        </nav> */}

        <Modal isOpen={loginModalIsOpen} style={customStylesLogin}>
          <div>
            <div>
              <i
                className="fa fa-close close-button"
                onClick={() => this.handleCloseModal("loginModalIsOpen", false)}
              />
            </div>
            <div>
              <div>
                <div>
                  <GoogleLogin
                    clientId="679436963896-bg3558k31ftgvfupu68v53f25rhgruj3.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={"single_host_origin"}
                    className="login-gmail"
                  />
                </div>
                {/* <div>
                                <span className='fa fa-facebook logo-facebook'></span>
                            <FacebookLogin
                                appId="1484101825269453"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={this.responseFacebook}
                                cssClass="login-facebook-button" />
                            </div> */}
                <div className="login-or">OR</div>

                <div style={{ paddingBottom: "0.5rem" }}>
                  <h5 className="login-email-modal-title">Login with Email</h5>
                </div>
                <div>
                  <form onSubmit={this.handleLoginAPI}>
                    <input
                      name="userEmail"
                      type="email"
                      className="input-login"
                      placeholder="Enter your email"
                      onChange={this.handleInputChange}
                    />
                    <input
                      name="userPassword"
                      type="password"
                      className="input-login"
                      placeholder="Enter your password"
                      onChange={this.handleInputChange}
                    />
                    <div
                      style={{
                        color: "#ce0505",
                        fontWeight: 500,
                        fontSize: "1rem",
                        backgroundColor: "lightred",
                      }}
                    >
                      {errorResponse}
                    </div>
                    <div>
                      <button type="submit" className="button-login-email">
                        Login
                      </button>
                      <button
                        type="button"
                        className="button-forget-password"
                        onClick={this.handleForgetPassword}
                      >
                        Forget Password
                      </button>
                    </div>
                  </form>
                </div>
                {/* <div>{errorResponse }</div> */}
                <div
                  style={{
                    marginTop: "6rem",
                    borderTop: "solid 0.5px #ababab",
                    paddingTop: "10px",
                  }}
                >
                  <h6>
                    New to ZCAD?{" "}
                    <span
                      className="login-button-create-account-modal"
                      onClick={this.handleCreateAccount}
                    >
                      Create account
                    </span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={createAccountModalIsOpen} style={customStylesLogin}>
          <div>
            <div>
              <i
                className="fa fa-close close-button"
                onClick={() =>
                  this.handleCloseModal("createAccountModalIsOpen", false)
                }
              />
            </div>
            <div>
              <div>
                <div style={{ paddingBottom: "1rem" }}>
                  <h5 className="create-account-modal-title">
                    Create an account
                  </h5>
                </div>
                <div>
                  <form onSubmit={this.createAccount}>
                    <div className="row">
                      <label
                        htmlFor="userName"
                        className="label-create-account col-3"
                      >
                        Name<span style={{ color: "#ce0505" }}> *</span>
                      </label>
                      <input
                        required={true}
                        name="userName"
                        type="text"
                        value={userName}
                        className="input-create-account col-9"
                        onChange={this.handleInputChange}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="row">
                      <label
                        htmlFor="userEmail"
                        className="label-create-account col-3"
                      >
                        Email<span style={{ color: "#ce0505" }}> *</span>
                      </label>
                      <input
                        required={true}
                        name="userEmail"
                        type="email"
                        value={userEmail}
                        className="input-create-account col-9"
                        onChange={this.handleInputChange}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="row">
                      <label
                        htmlFor="userPhone"
                        className="label-create-account col-3"
                      >
                        Phone
                      </label>
                      <input
                        name="userPhone"
                        type="telephone"
                        value={userPhone}
                        className="input-create-account col-9"
                        onChange={this.handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="row">
                      <label
                        htmlFor="userAddress"
                        className="label-create-account col-3"
                      >
                        Address
                      </label>
                      <input
                        name="userAddress"
                        type="text"
                        value={userAddress}
                        className="input-create-account input-address col-9"
                        onChange={this.handleInputChange}
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="row">
                      <label
                        htmlFor="userPassword"
                        className="label-create-account col-3"
                      >
                        Password<span style={{ color: "#ce0505" }}> *</span>
                      </label>
                      <input
                        required={true}
                        name="userPassword"
                        type="password"
                        value={userPassword}
                        className="input-create-account col-9"
                        onChange={this.handleInputChange}
                        placeholder="Create new password"
                      />
                    </div>

                    <div className="row">
                      <label
                        htmlFor="userConfirmPassword"
                        className="label-create-account col-3"
                      >
                        Confirm Password
                        <span style={{ color: "#ce0505" }}> *</span>
                      </label>
                      <input
                        required={true}
                        name="userConfirmPassword"
                        type="password"
                        value={userConfirmPassword}
                        className="input-create-account col-9"
                        onChange={this.handleInputChange}
                        placeholder="Type password again"
                      />
                    </div>

                    <button type="submit" className="button-create-account">
                      Create account
                    </button>
                  </form>
                  <div
                    style={{
                      marginTop: "4.2rem",
                      borderTop: "solid 0.5px #ababab",
                      paddingTop: "10px",
                    }}
                  >
                    <h5>
                      Already have an account?{" "}
                      <span
                        className="login-button-create-account-modal"
                        onClick={this.handleLogin}
                      >
                        Log In
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={forgetPasswordModalIsOpen} style={customStylesLogin}>
          <div>
            <div>
              <i
                className="fa fa-close close-button"
                onClick={() =>
                  this.handleCloseModal("forgetPasswordModalIsOpen", false)
                }
              />
            </div>
            <div>
              <div>
                <div style={{ paddingBottom: "0.5rem" }}>
                  <h5 className="login-email-modal-title">Forget password?</h5>
                </div>
                <div>
                  <form>
                    <input
                      name="userEmail"
                      type="email"
                      className="input-login"
                      placeholder="Enter your email"
                      onChange={this.handleInputChange}
                    />
                    <div>
                      <button
                        type="button"
                        className="button-reset-password"
                        onClick={this.handleResetPassword}
                      >
                        Reset Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* {loginModalToLogin ?<Modal isOpen={loginModalFromPageHeader} style={customStylesLogin}>
                <div >
                    <h4>You have already registered<br />Please Login to place order</h4>
                    <button onClick={this.handleLoginFromDetailsJs}>Login</button>
                </div>
            </Modal>:null
            } */}
        {/* <Modal isOpen={loginModalToLogin} style={customStylesLogin}>
                <div >
                    <h4>You have already registered<br />Please Login to place order</h4>
                    <button onClick={this.handleLoginFromDetailsJs}>Login</button>
                </div>
            </Modal> */}
      </div>
    );
  }
}

export default withRouter(LoginSection);
