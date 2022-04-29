import React from "react";
import "../styles/filter.css";
import { withRouter } from "react-router-dom";

class RestaurantItem extends React.Component {
  handleNavigateDetails = (restaurantId) => {
    this.props.history.push(`/details?restaurantId=${restaurantId}`);
  };

  render() {
    const { restaurantData } = this.props;
    return (
      <div
        className="items"
        onClick={() => this.handleNavigateDetails(restaurantData._id)}
      >
        <div className="items-top">
          <div className="images">
            {" "}
            <img src={restaurantData.thumb} alt="" />{" "}
          </div>
          <div className="item-desc">
            <div className="restaurant-name">{restaurantData.name}</div>
            <div className="address-line1">{restaurantData.locality}</div>
            <div className="address-line2">{restaurantData.city_name}</div>
          </div>
        </div>
        <div className="items-bottom">
          <div className="items-bot-left">
            <div>CUISINES:</div>
            <div>COST FOR TWO:</div>
          </div>
          <div className="items-bot-right">
            <div>
              {restaurantData.Cuisine.map((cuisine) => `${cuisine.name} | `)}
            </div>
            <div>{restaurantData.cost}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RestaurantItem);
