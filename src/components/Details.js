import React, { Component } from "react";
import axios from "axios";
import PageHeader from "./PageHeader";
import queryString from "query-string";
import "../styles/details.css";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
// import LoginSection from './LoginSection';

const customStylesMenu = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "80%",
    zIndex: "2",
  },
};

const customStylesGallery = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "fit-content",
  },
};

const customStylesPaymentForm = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    maxWidth: "80%",
    transform: "translate(-50%, -50%)",
    border: "solid 2px darkgrey",
    borderRadius: "1rem",
  },
};

const customStylesPaymentAfterForm = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    maxWidth: "80%",
    // minHeight: "80vh",
    transform: "translate(-50%, -50%)",
    border: "solid 2px darkgrey",
    borderRadius: "1rem",
  },
};

class Details extends Component {
  constructor() {
    super();

    this.state = {
      restaurant: {},
      restaurantId: undefined,
      itemsList: [],
      itemModalIsOpen: false,
      galleryModalIsOpen: false,
      subtotal: 0,
      paymentFormIsOpen: false,
      userName: undefined,
      userEmail: undefined,
      userAddress: undefined,
      userPhone: undefined,
      orderedItems: [],
      paymentAlertIsOpen: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const qs = queryString.parse(this.props.location.search);
    const { restaurantId } = qs;

    axios({
      url: `http://localhost:5001/restaurantDetails/${restaurantId}`,
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({ restaurant: response.data.details, restaurantId });
      })
      .catch();
  }

  handleOrder = () => {
    const { restaurantId } = this.state;
    axios({
      url: `http://localhost:5001/menu/${restaurantId}`,
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({
          itemsList: response.data.menuItems,
          itemModalIsOpen: true,
          subtotal: 0,
          orderedItems: [],
        });
      })
      .catch();
  };

  handleCloseModal = (state, value) => {
    this.setState({ [state]: value });
  };

  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.itemsList];
    const item = items[index];

    if (operationType === "add") {
      item.qty += 1;
    } else {
      item.qty -= 1;
    }
    items[index] = item;
    items.map((item) => {
      return (total += item.qty * item.price);
    });
    this.setState({
      itemsList: items,
      subtotal: total,
      orderedItems: items.filter((order) => order.qty > 0),
    });
  };

  handleGallery = () => {
    this.setState({ galleryModalIsOpen: true });
  };

  handlePaymentForm = () => {
    let loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    let loggedInUserName = localStorage.getItem("loggedInUserName");

    if (!loggedInUserEmail) {
      this.setState({
        paymentFormIsOpen: true,
        userEmail: undefined,
        userName: undefined,
        itemModalIsOpen: false,
      });
    } else {
      this.setState({
        userEmail: loggedInUserEmail,
        userName: loggedInUserName,
        paymentFormIsOpen: true,
        itemModalIsOpen: false,
      });
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === "[object Date]";
  }

  isObj = (val) => {
    return typeof val === "object";
  };

  stringifyValue = (val) => {
    if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  };

  buildForm = ({ action, params }) => {
    const form = document.createElement("form");
    console.log(params);
    form.setAttribute("method", "post");
    form.setAttribute("action", action);

    Object.keys(params).forEach((key) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", key);
      input.setAttribute("value", this.stringifyValue(params[key]));
      form.appendChild(input);
    });
    return form;
  };

  post = (details) => {
    const form = this.buildForm(details);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  getData = async (data) => {
    try {
      const response = await fetch(`http://localhost:5001/payment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (err) {
      return console.log(err);
    }
  };

  handlePayment = () => {
    const { userEmail, subtotal, orderedItems, userName, userAddress } =
      this.state;

    if (userEmail && userEmail.length > 0 && userEmail.includes("@")) {
      if (!localStorage.getItem("isLoggedIn")) {
        const reqObjEmail = { userEmail };
        axios({
          url: "http://localhost:5001/verify-user-before-payment",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: reqObjEmail,
        })
          .then((response) => {
            if (response.data.message === "proceed payment") {
              this.getData({ email: userEmail, amount: subtotal }).then(
                (response) => {
                  var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response,
                  };
                  this.post(information);
                  const reqObj = {
                    orderedItems,
                    userName,
                    userAddress,
                    userEmail,
                    orderId: response.ORDER_ID,
                  };
                  axios({
                    url: "http://localhost:5001/orderItems",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    data: reqObj,
                  })
                    .then(console.log("order data posted"))
                    .catch();
                }
              );
            } else {
              alert("You already have registered with us. PLease Log in...");
              this.setState({ paymentFormIsOpen: false });
            }
          })
          .catch();
      } else {
        this.getData({ email: userEmail, amount: subtotal }).then(
          (response) => {
            var information = {
              action: "https://securegw-stage.paytm.in/order/process",
              params: response,
            };
            this.post(information);
            const reqObj = {
              orderedItems,
              userName,
              userAddress,
              userEmail,
              orderId: response.ORDER_ID,
            };
            axios({
              url: "http://localhost:5001/orderItems",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              data: reqObj,
            })
              .then(console.log("order data posted"))
              .catch();
          }
        );
      }
    } else {
      alert("Please enter a valid email");
    }
  };

  handlePaymentAlert = () => {
    this.setState({ paymentAlertIsOpen: true, paymentFormIsOpen: false });
  };

  render() {
    const {
      restaurant,
      itemModalIsOpen,
      itemsList,
      subtotal,
      galleryModalIsOpen,
      paymentFormIsOpen,
      userName,
      userEmail,
      userAddress,
      userPhone,
      paymentAlertIsOpen,
    } = this.state;
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    return (
      <div>
        <PageHeader />
        <div className="container mt-3">
          <div className="restaurant-image-container">
            <img
              className="detailsImage"
              src={restaurant.thumb}
              height="100%"
              width="100%"
              alt="Not found"
            />
            <button
              className="btn btn-secondary galleryButton"
              onClick={this.handleGallery}
            >
              Click to see Images
            </button>
          </div>
          <div className="restaurant-name-line">
            <span className="restaurant-name-details">{restaurant.name}</span>
            <button className="placeOnlineOrder" onClick={this.handleOrder}>
              Place Online Order
            </button>
          </div>
          <div>
            <ul className="nav nav-tabs" id="restaurantDetails" role="tablist">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  id="overview-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#overview"
                >
                  Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#contact"
                >
                  Contact
                </button>
              </li>
            </ul>

            <div className="tab-content" id="restaurantDetailsContent">
              <div
                className="tab-pane show active"
                id="overview"
                role="tabpanel"
              >
                <div className="overview-tab-heading">About this place</div>
                <div className="overview-sub-heading">Cuisine</div>
                <div className="overview-contents">
                  {restaurant &&
                    restaurant.Cuisine &&
                    restaurant.Cuisine.map((item) => `${item.name} | `)}
                </div>
                <div className="overview-sub-heading">Average Cost</div>
                <div className="overview-contents">
                  &#8377;{`${restaurant.cost} for two people (approx.)`}
                </div>
              </div>
              <div className="tab-pane" id="contact" role="tabpanel">
                <div className="contact-sub-heading">Phone number</div>
                <div className="contact-contents" id="phone-number">
                  {restaurant.contact_number || "Not available"}
                </div>
                <div className="contact-sub-heading">{restaurant.name}</div>
                <div className="contact-contents">{restaurant.address}</div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={itemModalIsOpen}
          onRequestClose={() => this.handleCloseModal("itemModalIsOpen", false)}
          style={customStylesMenu}
        >
          <div className="item-modal-container">
            <div>
              <i
                className="fa fa-close close-button"
                onClick={() => this.handleCloseModal("itemModalIsOpen", false)}
              />
            </div>
            <div className="modal-restaurant-name">{restaurant.name}</div>

            {itemsList.map((item, index) => {
              return (
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    className="card modal-card-item"
                    style={{ margin: "auto" }}
                  >
                    <div className="row">
                      <div className="col-lg-9 col-md-9 col-sm-9 card-body">
                        {/* <span> */}
                        <div className="modal-card-item-name">{item.name}</div>
                        <div className="modal-card-item-price">
                          &#8377;{item.price}
                        </div>
                        <div className="modal-card-item-desc">
                          {item.description}{" "}
                        </div>
                        {/* </span> */}
                      </div>
                      <div className="col-lg-3 col-md-3 col-sm-3 item-img-section">
                        <img
                          src={`../${item.image}`}
                          className="modal-card-item-image"
                          alt="dish"
                        />
                        {item.qty === 0 ? (
                          <div>
                            <button
                              className="add-button"
                              onClick={() => this.addItems(index, "add")}
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <div className="add-number">
                            <button
                              className="minus-button"
                              onClick={() => this.addItems(index, "subtract")}
                            >
                              -
                            </button>
                            <span className="item-qty">{item.qty}</span>
                            <button
                              className="plus-button"
                              onClick={() => this.addItems(index, "add")}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="modal-item-checkout">
              <h3 className="modal-item-total">Sub total: {subtotal}</h3>
              <button
                className="btn btn-danger modal-item-pay"
                onClick={this.handlePaymentForm}
              >
                Pay Now
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={galleryModalIsOpen}
          onRequestClose={() =>
            this.handleCloseModal("galleryModalIsOpen", false)
          }
          style={customStylesGallery}
        >
          <div>
            <i
              className="fa fa-close close-button"
              onClick={() => this.handleCloseModal("galleryModalIsOpen", false)}
            />
          </div>

          <Carousel showThumbs={false} autoPlay={false}>
            {restaurant &&
              restaurant.thumbs &&
              restaurant.thumbs.map((item) => {
                return (
                  <div className="galleryCarouselImage">
                    <img src={`./${item}`} alt="dish gallery" />
                  </div>
                );
              })}
          </Carousel>
        </Modal>

        <Modal
          isOpen={paymentFormIsOpen}
          onRequestClose={() =>
            this.handleCloseModal("paymentFormIsOpen", false)
          }
          style={customStylesPaymentForm}
        >
          <div>
            <div>
              <i
                className="fa fa-close close-button"
                onClick={() =>
                  this.handleCloseModal("paymentFormIsOpen", false)
                }
              />
            </div>
            <div>
              <div>
                <div style={{ paddingBottom: "1rem" }}>
                  <h5 className="payment-form-title">User Details</h5>
                </div>
                <div>
                  <form>
                    {isLoggedIn && userName ? (
                      <div className="row">
                        <label
                          htmlFor="userName"
                          className="label-payment-form col-3"
                        >
                          Name
                        </label>
                        <input
                          disabled
                          name="userName"
                          type="text"
                          value={userName}
                          className="input-payment-form col-9"
                          onChange={this.handleInputChange}
                          placeholder="Enter your name"
                        />
                      </div>
                    ) : (
                      <div className="row">
                        <label
                          htmlFor="userName"
                          className="label-payment-form col-3"
                        >
                          Name
                        </label>
                        <input
                          name="userName"
                          type="text"
                          value={userName}
                          className="input-payment-form col-9"
                          onChange={this.handleInputChange}
                          placeholder="Enter your name"
                        />
                      </div>
                    )}

                    {isLoggedIn && userEmail ? (
                      <div className="row">
                        <label
                          htmlFor="userEmail"
                          className="label-payment-form col-3"
                        >
                          Email
                        </label>
                        <input
                          disabled
                          name="userEmail"
                          type="email"
                          value={userEmail}
                          className="input-payment-form col-9"
                          onChange={this.handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                    ) : (
                      <div className="row">
                        <label
                          htmlFor="userEmail"
                          className="label-payment-form col-3"
                        >
                          Email
                        </label>
                        <input
                          required={true}
                          name="userEmail"
                          type="email"
                          value={userEmail}
                          className="input-payment-form col-9"
                          onChange={this.handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                    )}

                    <div className="row">
                      <label
                        htmlFor="userPhone"
                        className="label-payment-form col-3"
                      >
                        Phone
                      </label>
                      <input
                        name="userPhone"
                        type="telephone"
                        value={userPhone}
                        className="input-payment-form col-9"
                        onChange={this.handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="row">
                      <label
                        htmlFor="userAddress"
                        className="label-payment-form col-3"
                      >
                        Address
                      </label>
                      <input
                        name="userAddress"
                        type="text"
                        value={userAddress}
                        className="input-payment-form input-address col-9"
                        onChange={this.handleInputChange}
                        placeholder="Enter your address"
                      />
                    </div>

                    <button
                      type="button"
                      className=" btn btn-danger button-proceed-checkout"
                      onClick={this.handlePaymentAlert}
                    >
                      Proceed to pay
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={paymentAlertIsOpen}
          onRequestClose={() =>
            this.handleCloseModal("paymentAlertIsOpen", false)
          }
          style={customStylesPaymentAfterForm}
        >
          <div>
            <i
              className="fa fa-close close-button"
              onClick={() => this.handleCloseModal("paymentAlertIsOpen", false)}
            />
          </div>
          <div className="payment-alert">
            <div className="alert-title">It is a test payment gateway..</div>
            <h6 className="alert-note">
              *Please do not use your original credentials instead use the
              following credetials for making payment
            </h6>
            <hr />
            <section className="row test-creds">
              <h6 className="col-12">Test Wallet Credentials</h6>
              <div className="credentials-left col-6">
                <span className="col-3">Phone</span>
              </div>
              <div className="credentials-right col-6">
                <span className="col-3 value">7777777777</span>
              </div>
              <div className="credentials-left col-6">
                <span className="col-3">Password</span>
              </div>
              <div className="credentials-right col-6">
                <span className="col-3 value">Paytm12345</span>
              </div>
              <div className="credentials-left col-6">
                <span className="col-3">OTP</span>
              </div>
              <div className="credentials-right col-6">
                <span className="col-3 value">489871</span>
              </div>
            </section>
            <hr />
            <section className="row test-creds">
              <h6 className="col-12">Test Card Credentials</h6>
              <div className="credentials-left col-6">
                <span className="col-3">Card Number</span>
              </div>
              <div className="credentials-right col-6">
                <span className="col-3 value">Any Visa or Master Card</span>
              </div>
              <div class="credentials-left col-6">
                <span className="col-3">Exp. Month & Year</span>
              </div>
              <div className="credentials-right col-6">
                <span className="col-3 value">Any Future month and Year</span>
              </div>
              <div className="credentials-left col-6">
                <span className="col-3">CVV</span>
              </div>
              <div className="credentials-right col-6">
                <span className="col-3 value">123</span>
              </div>
            </section>

            <button
              className="btn btn-danger button-proceed-checkout"
              onClick={this.handlePayment}
            >
              Proceed to pay
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Details;
