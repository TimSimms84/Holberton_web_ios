import React, { Component } from 'react';
import propTypes from 'prop-types';
import '../../App.css';

class NavTab extends Component {
  render() {
    const { title, selector, isActive } = this.props;
    return (
      <div
        className={`navItem ${isActive ? 'active' : ''}`}
        onClick={(e) => {selector(e)}}>
        <h3>{title}</h3>
      </div>
    );
  }
}

NavTab.propTypes = {
  title: propTypes.string.isRequired,
  isActive: propTypes.bool,
  selector: propTypes.func,
};

NavTab.defaultProps = {
  isActive: false,
};

export default NavTab;
