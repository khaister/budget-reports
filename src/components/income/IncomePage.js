import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import PageLayout from '../page/PageLayout';
import { GenericEntitiesSection, MonthByMonthSection } from '../common';
import {
  useFlagState,
  useMonthExclusions,
  useSelectedEntityId,
  useSelectedMonth
} from '../../commonHooks';
import { notAny, simpleMemoize } from '../../utils/dataUtils';
import {
  getFirstMonth,
  getTransactionMonth,
  isIncome,
  isStartingBalanceOrReconciliation,
  isTransfer,
  sanitizeName
} from '../../utils/budgetUtils';

const getFilteredTransactions = simpleMemoize(
  (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) => {
    const firstMonth = getFirstMonth(budget);
    const lastMonth = moment().format('YYYY-MM');
    return budget.transactions.filter(
      notAny([
        isStartingBalanceOrReconciliation(budget),
        isTransfer(investmentAccounts),
        transaction =>
          excludeFirstMonth && getTransactionMonth(transaction) === firstMonth,
        transaction =>
          excludeLastMonth && getTransactionMonth(transaction) === lastMonth
      ])
    );
  }
);

const getFilteredIncomeTransactions = simpleMemoize(
  (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) =>
    getFilteredTransactions(
      budget,
      investmentAccounts,
      excludeFirstMonth,
      excludeLastMonth
    ).filter(transaction => isIncome(budget)(transaction))
);

const IncomePage = ({
  budget,
  historyAction,
  investmentAccounts,
  location,
  sidebarTrigger,
  title
}) => {
  const {
    excludeFirstMonth,
    excludeLastMonth,
    months,
    onSetExclusion
  } = useMonthExclusions(budget);
  const [selectedMonth, onSelectMonth] = useSelectedMonth();
  const [selectedPayeeId, onSelectPayeeId] = useSelectedEntityId();
  const [showAverage, , , onToggleShowAverage] = useFlagState(true);

  const { payeesById } = budget;
  const filteredTransactions = getFilteredIncomeTransactions(
    budget,
    investmentAccounts,
    excludeFirstMonth,
    excludeLastMonth
  );
  const transactionsInSelectedMonth =
    selectedMonth &&
    filteredTransactions.filter(
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
            expectPositive
            highlightFunction={
              selectedPayeeId &&
              (transaction => transaction.payee_id === selectedPayeeId)
            }
            months={months}
            selectedMonth={selectedMonth}
            title={
              selectedPayeeId
                ? `Month by Month: ${sanitizeName(
                  budget.payeesById[selectedPayeeId].name
                )}`
                : 'Month by Month'
            }
            transactions={filteredTransactions}
            onSelectMonth={onSelectMonth}
            onSetExclusion={onSetExclusion}
          />
          <GenericEntitiesSection
            key={`payee-${selectedMonth || 'all'}`}
            entityKey='payee_id'
            entitiesById={payeesById}
            numMonths={selectedMonth ? 1 : months.length}
            reverse
            title={
              selectedMonth
                ? `Payees: ${moment(selectedMonth).format('MMMM')}`
                : 'Payees'
            }
            transactions={transactionsInSelectedMonth || filteredTransactions}
            selectedEntityId={selectedPayeeId}
            showAverageToggle={!selectedMonth}
            showAverage={showAverage}
            onClickEntity={onSelectPayeeId}
            onToggleAverage={onToggleShowAverage}
          />
        </Fragment>
      }
    />
  );
};

IncomePage.propTypes = {
  budget: PropTypes.object.isRequired,
  historyAction: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default IncomePage;
