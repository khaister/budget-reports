import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import pages, { makeLink } from "../../pages";
import { StrongText } from "../common/typeComponents";
import Section from "../common/Section";
import Loading from "../common/Loading";

class Budgets extends Component {
  static propTypes = {
    budgets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    budgetsLoaded: PropTypes.bool.isRequired,
    onRequestBudgets: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (!this.props.budgetsLoaded) {
      this.props.onRequestBudgets();
    }
  }

  render() {
    const { budgets, budgetsLoaded } = this.props;

    if (!budgetsLoaded) {
      return <Loading />;
    }

    return (
      <Section>
        <StrongText>Select a budget:</StrongText>
        {budgets.map(({ id, name }) => (
          <div key={id}>
            <Link to={makeLink(pages.currentMonth.path, { budgetId: id })}>
              {name}
            </Link>
          </div>
        ))}
      </Section>
    );
  }
}

export default Budgets;
