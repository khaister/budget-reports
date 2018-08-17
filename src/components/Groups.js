import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { notAny } from "../dataUtils";
import {
  getFirstMonth,
  getNumMonths,
  isStartingBalanceOrReconciliation,
  isTransfer,
  isIncome,
  getTransactionMonth,
  sanitizeName
} from "../budgetUtils";
import { TRENDS_SHOW_AVERAGE, getSetting, setSetting } from "../uiRepo";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Groups extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    onSelectGroup: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedGroupId: PropTypes.string,
    selectedMonth: PropTypes.string
  };

  constructor(props) {
    super();
    this.state = {
      showAverage: getSetting(TRENDS_SHOW_AVERAGE, props.budget.id)
    };
  }

  handleToggleGroupAverage = () => {
    this.setState(
      state => ({ ...state, showAverage: !state.showAverage }),
      () => {
        setSetting(
          TRENDS_SHOW_AVERAGE,
          this.props.budget.id,
          this.state.showAverage
        );
      }
    );
  };

  render() {
    const {
      budget,
      investmentAccounts,
      selectedMonth,
      selectedGroupId,
      onSelectGroup,
      onSelectMonth
    } = this.props;
    const { showAverage } = this.state;
    const {
      transactions,
      categoryGroupsById,
      categoriesById,
      id: budgetId
    } = budget;
    const selectedGroup =
      selectedGroupId && categoryGroupsById[selectedGroupId];
    const firstMonth = getFirstMonth(budget);
    const numMonths = getNumMonths(budget);
    const filteredTransactions = transactions.filter(
      notAny([
        isStartingBalanceOrReconciliation(budget),
        isTransfer(investmentAccounts),
        isIncome(budget)
      ])
    );

    const transactionsForMonth =
      selectedMonth &&
      filteredTransactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          highlightFunction={
            selectedGroupId &&
            (transaction =>
              categoriesById[transaction.category_id].category_group_id ===
              selectedGroupId)
          }
          transactions={filteredTransactions}
          onSelectMonth={onSelectMonth}
          title={
            selectedGroup
              ? `Month by Month: ${sanitizeName(selectedGroup.name)}`
              : "Month by Month"
          }
        />
        <GenericEntitiesSection
          key={selectedMonth || "all"}
          entityFunction={transaction =>
            categoriesById[transaction.category_id].category_group_id
          }
          entityKey="category_group_id"
          entitiesById={categoryGroupsById}
          linkFunction={categoryGroupId =>
            makeLink(pages.group.path, { budgetId, categoryGroupId })
          }
          selectedEntityId={selectedGroupId}
          title={
            selectedMonth
              ? `Category Groups: ${moment(selectedMonth).format("MMMM")}`
              : "Category Groups"
          }
          transactions={transactionsForMonth || filteredTransactions}
          onClickEntity={onSelectGroup}
          numMonths={numMonths}
          showAverageToggle={!selectedMonth}
          showAverage={showAverage && !selectedMonth}
          onToggleAverage={this.handleToggleGroupAverage}
          limitShowing
        />
      </Fragment>
    );
  }
}

export default Groups;
