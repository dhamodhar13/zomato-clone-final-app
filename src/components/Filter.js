import React from "react";
import axios from "axios";
import "../styles/filter.css";
import queryString from "query-string";
import RestaurantItem from "./RestaurantItem";
import PageHeader from "./PageHeader";

class Filter extends React.Component {
  handleNavigate = () => {
    this.props.history.push("/");
  };

  // --------------------------------------- Constructor ------------------------------------------
  constructor() {
    super();
    // window.scrollTo(0, 0);
    this.state = {
      restaurants: [],
      mealtype: undefined,
      location: undefined,
      cuisine: [],
      lcost: undefined,
      hcost: undefined,
      sort: undefined,
      page: 1,
      locationInput: [],
      pageCount: [],
      mealtypeName: undefined,
      locationName: undefined,
    };
    // this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  // ------------------------------------- componentDidMount --------------------------------------
  componentDidMount() {
    window.scrollTo(0, 0);
    // Read the query string params from url
    const querystring = queryString.parse(this.props.location.search);
    const { mealtype, location, mealtypename, locationName } = querystring;

    const reqObj = {
      mealtype: mealtype,
      locationId: location,
    };

    // location API call
    axios({
      url: "http://localhost:5001/location",
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({
          locationInput: response.data.location,
          mealtypeName: mealtypename,
          locationName: locationName ? locationName : "All locations",
        });
      })
      .catch();

    // filter API call with request params
    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          mealtype,
          location,
          pageCount: res.data.pageCount,
        });
      })
      .catch();
  }

  // -------------------------------------- Event handlers ----------------------------------------
  // -------------------------------------- 1. Handle sort ----------------------------------------
  handleSort = (sort) => {
    const { mealtype, cuisine, location, lcost, hcost, page } = this.state;
    const reqObj = {
      sort,
      mealtype,
      locationId: location,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
      lCost: lcost,
      hCost: hcost,
      page: page === 1 ? page : 1,
    };
    console.log(reqObj);

    // filter API call with request params
    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          sort,
          pageCount: res.data.pageCount,
          page: 1,
        });
      })
      .catch();
  };

  // -------------------------------------- 2. Handle cost ----------------------------------------
  handleCostChange = (lcost, hcost) => {
    const { mealtype, location, cuisine, sort, page } = this.state;
    const reqObj = {
      lCost: lcost,
      hCost: hcost,
      sort,
      mealtype,
      locationId: location,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
      page: page === 1 ? page : 1,
    };
    console.log(reqObj);

    // filter API call with request params
    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          lcost,
          hcost,
          pageCount: res.data.pageCount,
          page: 1,
        });
      })
      .catch();
  };

  // -------------------------------------- 3. Handle cuisine -------------------------------------
  handleCuisineChange = (value) => {
    const { cuisine, mealtype, location, sort, lcost, hcost, page } =
      this.state;
    const newCuisine = [...cuisine];
    if (cuisine.includes(value)) {
      const valueIndex = cuisine.indexOf(value);
      newCuisine.splice(valueIndex, 1);
    } else {
      newCuisine.push(value);
    }
    const reqObj = {
      mealtype,
      locationId: location,
      sort,
      page: page === 1 ? page : 1,
      lCost: lcost,
      hCost: hcost,
      cuisine: newCuisine.length === 0 ? undefined : newCuisine,
    };
    console.log(reqObj);

    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          cuisine: newCuisine,
          pageCount: res.data.pageCount,
          page: 1,
        });
      })
      .catch();
  };

  // -------------------------------------- 4. Handle location ------------------------------------
  handleLocationChange = (event) => {
    const { mealtype, cuisine, sort, lcost, hcost, page, locationInput } =
      this.state;
    let currentLocation = event.target.value;
    currentLocation = currentLocation === "0" ? undefined : currentLocation;

    const locationInputLength = locationInput.length;
    for (let i = 0; i < locationInputLength; i++) {
      if (locationInput[i].location_id === currentLocation) {
        sessionStorage.setItem("locationName", locationInput[i].name);
        break;
      } else {
        sessionStorage.setItem("locationName", "All locations");
      }
    }
    let locationName = sessionStorage.getItem("locationName");

    const reqObj = {
      locationId: currentLocation,
      mealtype,
      sort,
      page: page === 1 ? page : 1,
      lCost: lcost,
      hCost: hcost,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
    };

    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          location: currentLocation,
          pageCount: res.data.pageCount,
          page: 1,
          locationName: locationName,
        });
      })
      .catch();
  };

  // -------------------------------------- 5. Handle pagination ----------------------------------
  handlePageChange = (event) => {
    let newPage = Number(event.target.value);
    const { mealtype, location, cuisine, sort, lcost, hcost } = this.state;
    const reqObj = {
      locationId: location,
      mealtype,
      sort,
      page: newPage,
      lCost: lcost,
      hCost: hcost,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
    };

    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          page: newPage,
          pageCount: res.data.pageCount,
        });
      })
      .catch();
  };

  // ----------------------------- 6. Handle previous page and next page --------------------------
  handlePageNavigation = (where) => {
    const { page, mealtype, location, cuisine, sort, lcost, hcost } =
      this.state;
    let newPage;
    if (where === "prev") {
      newPage = page - 1;
    } else {
      newPage = page + 1;
    }
    const reqObj = {
      locationId: location,
      mealtype,
      sort,
      page: newPage,
      lCost: lcost,
      hCost: hcost,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
    };

    axios({
      url: "http://localhost:5001/filterRestaurant",
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      data: reqObj,
    })
      .then((res) => {
        this.setState({
          restaurants: res.data.restaurant,
          page: newPage,
          pageCount: res.data.pageCount,
        });
      })
      .catch();
  };

  // ------------------------------------ Render to the DOM ---------------------------------------
  render() {
    const {
      restaurants,
      locationInput,
      pageCount,
      page,
      mealtypeName,
      locationName,
    } = this.state;
    return (
      <div>
        <PageHeader />

        <div className="container">
          <div className="row page-header">
            <p className="col">
              {" "}
              {mealtypeName} Places in {locationName}
            </p>
          </div>
        </div>

        <div className="container" id="filter-section-wrapper">
          <div className="row m-2">
            <div className="filter-section col-lg-3 col-md col-sm-12">
              <div className="title mb-3">
                <span>Filters</span>
                <a
                  href="#filterCollapse"
                  className="format visibleFilter"
                  style={{ float: "right" }}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="filterCollapse"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-expand"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"
                    />
                  </svg>
                </a>
              </div>

              <div id="filterCollapse" className="collapse">
                <div className="subtitle mb-2">Select Location</div>
                <div>
                  <select
                    className="form-select mb-3"
                    onChange={this.handleLocationChange}
                  >
                    <option value="0">Select</option>
                    {locationInput.map((item, index) => {
                      return (
                        <option key={index} value={item.location_id}>
                          {" "}
                          {item.name}{" "}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="subtitle mb-2" name="cuisine">
                  Cuisine
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="1"
                    id="northIndian"
                    name="cuisine"
                    onChange={() => this.handleCuisineChange("1")}
                  />
                  <label className="form-check-label" htmlFor="northIndian">
                    North Indian
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="2"
                    id="southIndian"
                    name="cuisine"
                    onChange={() => this.handleCuisineChange("2")}
                  />
                  <label className="form-check-label" htmlFor="southIndian">
                    South Indian
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="3"
                    id="chinese"
                    name="cuisine"
                    onChange={() => this.handleCuisineChange("3")}
                  />
                  <label className="form-check-label" htmlFor="chinese">
                    Chinese
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="4"
                    id="fastFood"
                    name="cuisine"
                    onChange={() => this.handleCuisineChange("4")}
                  />
                  <label className="form-check-label" htmlFor="fastFood">
                    Fast Food
                  </label>
                </div>
                <div className="form-check options mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="5"
                    id="streetFood"
                    name="cuisine"
                    onChange={() => this.handleCuisineChange("5")}
                  />
                  <label className="form-check-label" htmlFor="streetFood">
                    Street Food
                  </label>
                </div>

                <div className="subtitle mb-2" name="costForTwo">
                  Cost For Two
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="costForTwo"
                    id="lessThan500"
                    onChange={() => this.handleCostChange(1, 500)}
                  />
                  <label className="form-check-label" htmlFor="lessThan500">
                    Less than ₹500
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="costForTwo"
                    id="500to1000"
                    onChange={() => this.handleCostChange(501, 1000)}
                  />
                  <label className="form-check-label" htmlFor="500to1000">
                    ₹500 to ₹1000
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="costForTwo"
                    id="1000to1500"
                    onChange={() => this.handleCostChange(1001, 1500)}
                  />
                  <label className="form-check-label" htmlFor="1000to1500">
                    ₹1000 to ₹1500
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="costForTwo"
                    id="1500to2000"
                    onChange={() => this.handleCostChange(1501, 2000)}
                  />
                  <label className="form-check-label" htmlFor="1500to2000">
                    ₹1500 to ₹2000
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="costForTwo"
                    id="moreThan2000"
                    onChange={() => this.handleCostChange(2001, 25000)}
                  />
                  <label className="form-check-label" htmlFor="moreThan2000">
                    ₹2000+
                  </label>
                </div>
                <div className="form-check options mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="costForTwo"
                    id="all"
                    onChange={() => this.handleCostChange(1, 25000)}
                  />
                  <label className="form-check-label" htmlFor="all">
                    All
                  </label>
                </div>

                <div className="title mb-2" name="sort">
                  Sort
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sort"
                    id="lowToHigh"
                    onChange={() => this.handleSort(1)}
                  />
                  <label className="form-check-label" htmlFor="lowToHigh">
                    Price low to high
                  </label>
                </div>
                <div className="form-check options">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sort"
                    id="highToLow"
                    onChange={() => this.handleSort(-1)}
                  />
                  <label className="form-check-label" htmlFor="highToLow">
                    Price high to low
                  </label>
                </div>
              </div>
            </div>

            <div className="itemsBlock col-lg-8 offset-lg-1 col-md-9 col-sm-12">
              {restaurants.length !== 0 ? (
                <div>
                  {restaurants.map((item, index) => {
                    return <RestaurantItem key={index} restaurantData={item} />;
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
                <div className="noRecordsMsg"> Sorry! No Records Found... </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
