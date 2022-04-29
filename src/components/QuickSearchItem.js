import React from "react";
import "../styles/home.css";
import { withRouter } from "react-router-dom";

class QuickSearchItem extends React.Component {
  handleNavigate = (name, mealtype_id) => {
    const locationId = sessionStorage.getItem("location");
    const locationName = sessionStorage.getItem("locationName");

    if (locationId) {
      this.props.history.push(
        `/filter?mealtype=${mealtype_id}&location=${locationId}&mealtypename=${name}&locationName=${locationName}`
      );
    } else {
      this.props.history.push(
        `/filter?mealtype=${mealtype_id}&mealtypename=${name}`
      );
    }
  };

  render() {
    const { quickSearchData } = this.props;
    const { name } = quickSearchData;
    const { mealtype_id } = quickSearchData;
    return (
      <div
        className="col-lg-4 col-md-6 col-sm-12"
        onClick={() => this.handleNavigate(name, mealtype_id)}
      >
        <div className="block">
          <img src={`./${quickSearchData.image}`} className="image" alt="" />
          <div className="content">
            <div className="content-title">{quickSearchData.name}</div>
            <div className="content-content">{quickSearchData.content}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(QuickSearchItem);
