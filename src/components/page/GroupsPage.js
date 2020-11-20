import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import PageLayout from "./PageLayout";
import {GenericEntitiesSection, MonthByMonthSection} from "../common";
import pages, { makeLink } from "../../pages";
import { getTransactionMonth, sanitizeName } from "../../utils/budgetUtils";
import { useTrendsShowAverage } from "../../commonHooks";

const GroupsPage = ({
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  historyAction,
  location,
  months,
  sidebarTrigger,
  title,
  transactions,
  selectedMonth,
  selectedGroupId,
  onSelectGroup,
  onSelectMonth,
  onSetExclusion
}) => {
  const [showAverage, onToggleShowAverage] = useTrendsShowAverage(budget.id);

  const { categoryGroupsById, categoriesById, id: budgetId } = budget;
  const selectedGroup = selectedGroupId && categoryGroupsById[selectedGroupId];

  const transactionsForMonth =
    selectedMonth &&
    transactions.filter(
      transaction => getTransactionMonth(transaction) === selectedMonth
    );

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      title={title}
      content={
        <Fragment>
          <MonthByMonthSection
            excludeFirstMonth={excludeFirstMonth}
            excludeLastMonth={excludeLastMonth}
            highlightFunction={
              selectedGroupId &&
              (transaction =>
                categoriesById[transaction.category_id].category_group_id ===
                selectedGroupId)
            }
            months={months}
            selectedMonth={selectedMonth}
            title={
              selectedGroup
                ? `Month by Month: ${sanitizeName(selectedGroup.name)}`
                : "Month by Month"
            }
            transactions={transactions}
            onSelectMonth={onSelectMonth}
            onSetExclusion={onSetExclusion}
          />
          <GenericEntitiesSection
            key={selectedMonth || "all"}
            entityFunction={transaction =>
              categoriesById[transaction.category_id].category_group_id
            }
            entityKey="category_group_id"
            entitiesById={categoryGroupsById}
            expectNegative
            linkFunction={categoryGroupId =>
              makeLink(pages.group.path, { budgetId, categoryGroupId })
            }
            selectedEntityId={selectedGroupId}
            title={
              selectedMonth
                ? `Category Groups: ${moment(selectedMonth).format("MMMM")}`
                : "Category Groups"
            }
            transactions={transactionsForMonth || transactions}
            onClickEntity={onSelectGroup}
            numMonths={months.length}
            showAverageToggle={!selectedMonth}
            showAverage={showAverage && !selectedMonth}
            onToggleAverage={onToggleShowAverage}
          />
        </Fragment>
      }
    />
  );
};

GroupsPage.propTypes = {
  budget: PropTypes.object.isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  historyAction: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectGroup: PropTypes.func.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedGroupId: PropTypes.string,
  selectedMonth: PropTypes.string
};

export default GroupsPage;
