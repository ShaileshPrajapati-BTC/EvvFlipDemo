import React, { Component } from "react";
import { connect } from "react-redux";
import NavigationStack from "./navigationStack";

class Navigation extends Component {
  render() {
    return (
      <NavigationStack/>
    );
  }
}

const mapStateToProps = state => {};

export default connect(mapStateToProps)(Navigation);