import React, { Component } from "react";
import axios from "axios";
import PageHeader from "./PageHeader";
import "../styles/user.css";
import "../styles/filter.css";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
      orderId: [],
      orderItems: [],
      orderAmount: [],
      restaurantName: [],
      restaurantAddress: [],
      orderDate: [],
      restaurantId: undefined,
      restaurants: [],
      isLoggedIn: localStorage.getItem("isLoggedIn"),
      userName: undefined,
      userPhone: undefined,
      userAddress: undefined,
      userEmail: undefined,
      pageCount: [],
      page: 1,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const userEmail = localStorage.getItem("loggedInUserEmail");
    const { page } = this.state;
    const reqObj = { userEmail };

    axios({
      url: "http://localhost:5001/userProfile",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: reqObj,
    })
      .then((response) => {
        this.setState({
          userName: response.data.profile[0].name,
          userPhone: response.data.profile[0].phone,
          userAddress: response.data.profile[0].address,
          userEmail: response.data.profile[0].email,
        });
      })
      .catch();

    const reqObjOrders = { userEmail, page };
    axios({
      url: "http://localhost:5001/orderHistory",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: reqObjOrders,
    })
      .then((response) => {
        // const filteredOrders = response.data.orders.filter(item => item.transactionData !== undefined);
        this.setState({
          orderData: response.data.orders,
          pageCount: response.data.pageCount,
        });
      })
      .catch();

    axios({
      url: "http://localhost:5001/allRestaurants",
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({ restaurants: response.data.restaurants });
      })
      .catch();
  }

  handleEditProfile = () => {
    document.getElementById("userName").disabled = false;
    document.getElementById("userPhone").disabled = false;
    document.getElementById("userAddress").disabled = false;
    document.getElementById("updateProfileBtn").style.display = "inline";
  };

  handleInputChange = (e) => {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    this.setState({ [name]: value });
  };

  handleUpdateProfile = () => {
    const { userName, userPhone, userAddress, userEmail } = this.state;
    const reqObj = {
      userName,
      userPhone,
      userAddress,
      userEmail,
    };
    axios({
      url: "http://localhost:5001/updateUserProfile",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: reqObj,
    })
      .then((response) => {
        alert(response.data.message);
      })
      .catch();
    document.getElementById("userName").disabled = true;
    document.getElementById("userPhone").disabled = true;
    document.getElementById("userAddress").disabled = true;
    document.getElementById("updateProfileBtn").style.display = "none";
    // document.getElementById([inputId]).disabled = true;
    // document.getElementById([updateId]).style.display = 'none';
  };

  // -------------------------------------- Handle pagination ----------------------------------
  handlePageChange = (event) => {
    let newPage = Number(event.target.value);
    const userEmail = localStorage.getItem("loggedInUserEmail");
    const reqObj = {
      userEmail,
      page: newPage,
    };

    axios({
      url: "http://localhost:5001/orderHistory",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((response) => {
        this.setState({
          orderData: response.data.orders,
          pageCount: response.data.pageCount,
          page: newPage,
        });
      })
      .catch();
  };

  // -------------------------------------- Handle previous page and next page ----------------------------------
  handlePageNavigation = (where) => {
    const { page } = this.state;
    let newPage;
    if (where === "prev") {
      newPage = page - 1;
    } else {
      newPage = page + 1;
    }
    const userEmail = localStorage.getItem("loggedInUserEmail");
    const reqObj = {
      userEmail,
      page: newPage,
    };

    axios({
      url: "http://localhost:5001/orderHistory",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((response) => {
        this.setState({
          orderData: response.data.orders,
          pageCount: response.data.pageCount,
          page: newPage,
        });
      })
      .catch();
  };

  render() {
    const {
      orderData,
      restaurants,
      userName,
      userPhone,
      userAddress,
      userEmail,
      page,
      pageCount,
    } = this.state;
    return (
      <div>
        <PageHeader />
        <div className="row whole-content container d-flex align-items-start">
          <div className="col-lg-3 col-md-3 col-sm-3 user-sidebar">
            <ul
              className="nav flex-column nav-tabs sidebar-buttons"
              role="tablist"
              id="userDetails"
            >
              <li className="nav-item">
                <button
                  className="nav-link active sidebar-button"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                >
                  Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link sidebar-button"
                  data-bs-toggle="tab"
                  data-bs-target="#orders"
                >
                  Orders
                </button>
              </li>
            </ul>
          </div>
          {/* <div className='col-lg-1'></div> */}

          <div className="col-lg-8 offset-lg-1 col-md-9 col-sm-9 user-content">
            <div className="tab-content" id="userDetailsContent">
              <div
                className="tab-pane show active"
                id="profile"
                role="tabpanel"
              >
                <form>
                  <div className="row">
                    <label
                      htmlFor="userName"
                      className="label-user-profile col-3"
                    >
                      Name
                    </label>
                    <input
                      disabled
                      required={true}
                      id="userName"
                      name="userName"
                      type="text"
                      value={userName}
                      className="input-user-profile col-9"
                      placeholder="Enter your name"
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <div className="row">
                    <label
                      htmlFor="userEmail"
                      className="label-user-profile col-3"
                    >
                      Email
                    </label>
                    <input
                      disabled
                      required={true}
                      name="userEmail"
                      id="userEmail"
                      type="email"
                      value={userEmail}
                      className="input-user-profile col-9"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="row">
                    <label
                      htmlFor="userPhone"
                      className="label-user-profile col-3"
                    >
                      Phone
                    </label>
                    <input
                      disabled
                      name="userPhone"
                      id="userPhone"
                      type="telephone"
                      value={userPhone}
                      className="input-user-profile col-9"
                      placeholder="Enter your phone number"
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <div className="row">
                    <label
                      htmlFor="userAddress"
                      className="label-user-profile col-3"
                    >
                      Address
                    </label>
                    <input
                      disabled
                      name="userAddress"
                      id="userAddress"
                      type="text"
                      value={userAddress}
                      className="input-user-profile input-address col-9"
                      placeholder="Enter your address"
                      onChange={this.handleInputChange}
                    />
                  </div>
                </form>
                <div style={{ textAlign: "center" }}>
                  <button id="editProfileBtn" onClick={this.handleEditProfile}>
                    Edit Profile
                  </button>
                  <button
                    id="updateProfileBtn"
                    style={{ display: "none" }}
                    onClick={this.handleUpdateProfile}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
              <div className="tab-pane" id="orders" role="tabpanel">
                {orderData.length !== 0 ? (
                  <div>
                    {orderData.map((item) => {
                      let restaurant = [];
                      restaurant.push(
                        restaurants.filter(
                          (resItem) =>
                            resItem._id ===
                            item.orderedItems.map(
                              (orderItem) => orderItem.restaurantId
                            )[0]
                        )
                      );
                      return (
                        <div className="order-history-items">
                          {/* <div><h5 style={{ padding:'0.2rem', borderRadius:'0.3rem', backgroundColor:'#fff'}}>Order ID: {item.orderId}</h5></div> */}
                          <div className="row">
                            {/* <div
                              className="col-2"
                            >
                              <div>Images</div>
                              {item.orderedItems.map((orderItem) => (
                                <div className="order-history-image">
                                  <img
                                    src={orderItem.image}
                                    width="90px"
                                    height="70px"
                                    alt="food item"
                                  />
                                </div>
                              ))}
                            </div> */}
                            <div className="col-12">
                              <div>
                                <h5
                                  style={{
                                    padding: "0.2rem",
                                    borderRadius: "0.3rem",
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  Order ID: {item.orderId}
                                </h5>
                              </div>
                              <div className="row">
                                <div className="col-4 order-history-label">
                                  Order Items:
                                </div>
                                <div className="col-8 order-history-input">
                                  {item.orderedItems.map((orderItem, index) => (
                                    <div>
                                      {index + 1} . {orderItem.name} | Price:{" "}
                                      {orderItem.price}{" "}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-4 order-history-label">
                                  Restaurant:
                                </div>
                                <div className="col-8 order-history-input">
                                  {restaurant[0].map((rest) => rest.name)[0]}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-4 order-history-label">
                                  Restaurant Address:
                                </div>
                                <div className="col-8 order-history-input">
                                  {restaurant[0].map((rest) => rest.address)[0]}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-4 order-history-label">
                                  Order Total:
                                </div>
                                <div className="col-8 order-history-input">
                                  {(item.transactionData &&
                                    item.transactionData.TXNAMOUNT) ||
                                    "No transaction found"}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-4 order-history-label">
                                  Ordered On:
                                </div>
                                <div className="col-8 order-history-input">
                                  {(item.transactionData &&
                                    item.transactionData.TXNDATE) ||
                                    "No transaction found"}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-4 order-history-label">
                                  Transaction Status:
                                </div>
                                <div className="col-8 order-history-input">
                                  {(item.transactionData &&
                                    item.transactionData.STATUS) ||
                                    "TXN_FAILURE"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <nav className="pagination-custom">
                      <ul className="pagination justify-content-center">
                        {page > 1 ? (
                          <li className="page-item page-num">
                            <button
                              className="page-link page-col"
                              onClick={() => this.handlePageNavigation("prev")}
                            >
                              <span>&laquo;</span>
                            </button>
                          </li>
                        ) : (
                          <span></span>
                        )}

                        {pageCount.map((item, index) => {
                          return (
                            <li className="page-item page-num" key={index}>
                              <button
                                className="page-link page-col"
                                value={item}
                                onClick={this.handlePageChange}
                              >
                                {item}
                              </button>
                            </li>
                          );
                        })}

                        {page < pageCount.length ? (
                          <li className="page-item page-num">
                            <button
                              className="page-link page-col"
                              onClick={() => this.handlePageNavigation("next")}
                            >
                              <span>&raquo;</span>
                            </button>
                          </li>
                        ) : (
                          <span></span>
                        )}
                      </ul>
                    </nav>
                  </div>
                ) : (
                  <div className="noRecordsMsg">
                    <h3>No orders found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
