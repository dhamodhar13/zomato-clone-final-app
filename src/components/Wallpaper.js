import React from "react";
import "../styles/home.css";
import "../styles/pageHeader.css";
import Modal from "react-modal";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import { withRouter } from "react-router-dom";
import PageHeader from "./PageHeader";

// const customStylesLoginHome = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     border: "solid 2px darkgrey",
//     borderRadius: "1rem",
//   },
// };

Modal.setAppElement("#root");

class Wallpaper extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loginModalIsOpen: false,
      createAccountModalIsOpen: false,
      userName: "",
      userEmail: "",
      userPhone: 0,
      userAddress: "",
      userPassword: "",
      userConfirmPassword: "",
      restaurants: [],
      inputTxt: undefined,
      filteredRestaurants: [],
      locationData: [],
    };
  }

  componentDidMount() {
    axios({
      url: "http://localhost:5001/location",
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({ locationData: response.data.location });
      })
      .catch();
  }

  handleChange = (event) => {
    const locationId = event.target.value;
    const { locationData } = this.state;
    const locationDataLength = locationData.length;
    for (let i = 0; i < locationDataLength; i++) {
      if (locationData[i].location_id === locationId) {
        sessionStorage.setItem("locationName", locationData[i].name);
        break;
      } else {
        sessionStorage.setItem("locationName", "All locations");
      }
    }
    if (locationId === "0") {
      sessionStorage.removeItem("location");
      sessionStorage.removeItem("locationName");
    } else {
      sessionStorage.setItem("location", locationId);
    }

    axios({
      url: `http://localhost:5001/restaurantByLocation/${locationId}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ restaurants: response.data.restaurant });
      })
      .catch();
  };

  handleRestInputChange = (event) => {
    const input = event.target.value;
    const { restaurants } = this.state;

    let filteredRest = [];

    if (input.length > 0) {
      filteredRest = restaurants.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      );
    }
    this.setState({ inputTxt: input, filteredRestaurants: filteredRest });
  };

  renderFilteredRestaurants = () => {
    const { filteredRestaurants } = this.state;

    if (filteredRestaurants.length === 0) {
      return null;
    }
    return (
      <ul className="render-suggestions">
        {filteredRestaurants.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => this.selectedRestaurant(item)}
            >{`${item.name}, ${item.locality}`}</li>
          );
        })}
      </ul>
    );
  };

  selectedRestaurant = (restaurant) => {
    this.props.history.push(`/details?restaurantId=${restaurant._id}`);
  };

  handleCloseModal = (state, value) => {
    this.setState({ [state]: value });
  };

  handleLogin = () => {
    this.setState({ loginModalIsOpen: true });
  };

  responseGoogle = (response) => {
    localStorage.setItem("loggedInUserName", response.profileObj.name);
    localStorage.setItem("isLoggedIn", true);
    this.setState({ loginModalIsOpen: false });
  };

  handleLogout = () => {
    localStorage.clear();
    this.setState({ isLoggedIn: false });
  };

  handleCreateAccount = () => {
    this.setState({
      createAccountModalIsOpen: true,
      userName: "",
      userEmail: "",
      userPhone: undefined,
      userAddress: "",
      userPassword: "",
      userConfirmPassword: "",
    });
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
        this.setState({ loginModalIsOpen: false });
      })
      .catch();
  };

  responseFacebook = (response) => {
    console.log(response);
  };

  render() {
    const { locationData } = this.props;
    const {
      loginModalIsOpen,
      createAccountModalIsOpen,
      userName,
      userEmail,
      userPhone,
      userAddress,
      userPassword,
      userConfirmPassword,
      inputTxt,
    } = this.state;
    // let loggedInUserName = localStorage.getItem('loggedInUserName');
    // let isLoggedIn = localStorage.getItem('isLoggedIn');
    // console.log(sessionStorage.getItem('locationName'));
    // console.log(this.state.locationData);
    return (
      <div>
        <div className="wallpaper">
          {/* <img
            src="./assets/homepageimg.png"
            height="375px"
            width="100%"
            alt="Not found"
          /> */}
          <PageHeader />
          {/* <div className="login-section">
            <LoginSection />
          </div> */}

          <div className="wallpaper-content">
            <div className="logo">d!</div>
            <div className="pageHeader">
              Find the best restaurants, cafés, and bars
            </div>
            <div className="searchBox">
              <div className="locSearch">
                <select
                  className="form-select"
                  name={locationData.name}
                  onChange={this.handleChange}
                >
                  <option value="0">Select</option>
                  {locationData.map((item, index) => {
                    return (
                      <option key={index} value={item.location_id}>
                        {" "}
                        {item.name}{" "}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="restSearch">
                <div className="input-group">
                  <span className="bg-white rest-search-symbol">
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="serach for restaurants"
                    id="restaurant-serach"
                    value={inputTxt}
                    onChange={this.handleRestInputChange}
                  />
                  {this.renderFilteredRestaurants()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={loginModalIsOpen}>
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
                    clientId=""
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={"single_host_origin"}
                    className="login-gmail"
                  />
                </div>
                <div>
                  <span className="fa fa-facebook logo-facebook"></span>
                  <FacebookLogin
                    appId=""
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.responseFacebook}
                    cssClass="login-facebook-button"
                  />
                </div>
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
                    <div>
                      <button type="submit" className="button-login-email">
                        Login
                      </button>
                      <button type="button" className="button-forget-password">
                        Forget Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={createAccountModalIsOpen}>
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
                        Name
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
                        Email
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
                        Password
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
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Wallpaper);
