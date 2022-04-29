import React from "react";
import axios from "axios";
import "../styles/home.css";
import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      mealTypes: [],
    };
  }

  componentDidMount() {
    sessionStorage.clear();
    axios({
      url: "http://localhost:5001/location",
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({ locations: response.data.location });
      })
      .catch((err) => console.log(err));

    axios({
      url: "http://localhost:5001/mealtype",
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        this.setState({ mealTypes: response.data.mealtype });
      })
      .catch();
  }

  render() {
    const { locations, mealTypes } = this.state;
    return (
      <div>
        <Wallpaper locationData={locations} />
        <QuickSearch quickSearchData={mealTypes} />
      </div>
    );
  }
}

export default Home;
