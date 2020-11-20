import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";
import moment from "moment";
import get from "lodash/fp/get";
import keyBy from "lodash/fp/keyBy";
import {
  getBudgets,
  getDefaultBudget,
  getUpdatedBudget,
  AUTHORIZE_URL,
  setLastLocation
} from "../ynabRepo";
import { setSetting, getSetting } from "../uiRepo";
import PageWrapper from "./PageWrapper";
import PageContent from "./PageContent";
import Unauthorized from "./Unauthorized";
import NotFound from "./NotFound";
import ErrorBoundary from "./ErrorBoundary";
import Budgets from "./Budgets";
import CurrencyContext from "./CurrencyContext";

class App extends Component {
  static propTypes = {
    hasToken: PropTypes.bool.isRequired
  };

  state = {
    authorized: true,
    budgetsLoaded: false,
    budgetIds: [],
    budgets: {},
    defaultBudget: getDefaultBudget(),
    budgetDetails: {},
    currentMonth: moment().format("YYYY-MM")
  };

  handleRequestBudgets = callback => {
    getBudgets().then(({ budgets, default_budget }) => {
      this.setState(
        {
          budgetsLoaded: true,
          budgetIds: budgets.map(b => b.id),
          budgets: keyBy("id")(budgets),
          defaultBudget: default_budget
        },
        callback
      );
    });
  };

  handleRequestBudget = id => {
    getUpdatedBudget(id).then(({ budget, authorized }) => {
      this.setState(state => ({
        ...state,
        authorized,
        budgetDetails: {
          ...state.budgetDetails,
          [id]: budget
        }
      }));
    });
  };

  handleAuthorize = () => {
    setLastLocation();
    window.location.replace(AUTHORIZE_URL);
  };

  render() {
    const { hasToken } = this.props;
    const {
      authorized,
      budgetsLoaded,
      budgetIds,
      budgets,
      defaultBudget,
      budgetDetails,
      currentMonth
    } = this.state;

    if (!hasToken) {
      return <Unauthorized onAuthorize={this.handleAuthorize} />;
    }

    return (
      <ErrorBoundary>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              defaultBudget && defaultBudget.id
                ? (<Redirect to={`/budgets/${defaultBudget.id}/current`} />)
                : (<Redirect to={`/budgets`} />)
            )}
          />
          <Route
            path="/budgets"
            exact
            render={() => (
              <Budgets
                budgets={budgetIds.map(id => budgets[id])}
                budgetsLoaded={budgetsLoaded}
                onRequestBudgets={this.handleRequestBudgets}
              />
            )}
          />
          <Route
            path="/budgets/:budgetId"
            render={({ match, history, location }) => {
              const { budgetId } = match.params;
              const budget = budgetDetails[budgetId];

              return (
                <PageWrapper
                  authorized={authorized}
                  budgetId={budgetId}
                  budgetLoaded={!!budget}
                  location={location.pathname}
                  onAuthorize={this.handleAuthorize}
                  onRequestBudget={this.handleRequestBudget}
                >
                  {({ sidebarTrigger }) => (
                    <CurrencyContext.Provider
                      value={get("currencyFormat")(budget)}
                    >
                      <PageContent
                        sidebarTrigger={sidebarTrigger}
                        historyAction={history.action}
                        location={location.pathname}
                        budget={budget}
                        currentMonth={currentMonth}
                        investmentAccounts={getSetting(
                          "investmentAccounts",
                          budgetId
                        )}
                        mortgageAccounts={getSetting(
                          "mortgageAccounts",
                          budgetId
                        )}
                        onUpdateAccounts={({ type, value }) => {
                          if (type === "investment") {
                            setSetting("investmentAccounts", budgetId, value);
                          }
                          if (type === "mortgage") {
                            setSetting("mortgageAccounts", budgetId, value);
                          }
                          this.forceUpdate();
                        }}
                      />
                    </CurrencyContext.Provider>
                  )}
                </PageWrapper>
              );
            }}
          />
          <Route component={NotFound} />
        </Switch>
      </ErrorBoundary>
    );
  }
}

export default App;
