import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/fp/compact';
import compose from 'lodash/fp/compose';
import find from 'lodash/fp/find';
import flatMap from 'lodash/fp/flatMap';
import mapRaw from 'lodash/fp/map';
import matchesProperty from 'lodash/fp/matchesProperty';
import sortBy from 'lodash/fp/sortBy';

import { MonthByMonthSettingsModal, CollapsibleSection } from '../common';
import { SecondaryText } from '../common/typeComponents';
import IncomeVsExpensesChart from './IncomeVsExpensesChart';
import Breakdowns from './Breakdowns';
import ChartNumbers from '../chart/ChartNumbers';
import PageLayout from '../page/PageLayout';
import { useSelectedMonth } from '../../commonHooks';
import { sumByProp, groupBy, simpleMemoize } from '../../utils/dataUtils';
import { getTransactionMonth, isIncome } from '../../utils/budgetUtils';


const map = mapRaw.convert({ cap: false });

const getSummaries = simpleMemoize((transactions, investmentAccounts, budget) =>
  compose([
    sortBy('month'),
    map((transactions, month) => {
      const grouped = groupBy(isIncome(budget))(transactions);

      return {
        month,
        expenseTransactions: grouped.false || [],
        incomeTransactions: grouped.true || [],
        income: sumByProp('amount')(grouped.true || []),
        expenses: sumByProp('amount')(grouped.false || [])
      };
    }),
    groupBy(getTransactionMonth)
  ])(transactions)
);

const IncomeVsExpensesPage = ({
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  historyAction,
  investmentAccounts,
  location,
  sidebarTrigger,
  title,
  transactions,
  onSetExclusion
}) => {
  const [selectedMonth, onSelectMonth] = useSelectedMonth();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showTotals, setShowTotals] = useState(false);
  const { categoriesById, categoryGroupsById, payeesById } = budget;

  const allSummaries = getSummaries(transactions, investmentAccounts, budget);
  const summaries = selectedMonth
    ? [find(matchesProperty('month', selectedMonth))(allSummaries)]
    : allSummaries;

  const incomeTransactions = flatMap(summary => summary.incomeTransactions)(
    compact(summaries)
  );
  const expenseTransactions = flatMap(summary => summary.expenseTransactions)(
    compact(summaries)
  );

  const totalExpenses = sumByProp('amount')(expenseTransactions);
  const totalIncome = sumByProp('amount')(incomeTransactions);
  const denominator = showTotals ? 1 : summaries.length;

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      title={title}
      content={
        <Fragment>
          <CollapsibleSection
            title='Monthly Trend'
            hasSettings
            onClickSettings={() => {
              setSettingsModalOpen(true);
            }}
            actions={
              <SecondaryText
                onClick={() => {
                  setShowTotals(!showTotals);
                }}
              >
                {showTotals ? 'show average' : 'show total'}
              </SecondaryText>
            }
          >
            <ChartNumbers
              expectPositive
              numbers={[
                {
                  label: 'net income',
                  amount: (totalExpenses + totalIncome) / denominator
                },
                {
                  label: 'expenses',
                  amount: -totalExpenses / denominator
                },
                {
                  label: 'income',
                  amount: totalIncome / denominator
                }
              ]}
            />
            <IncomeVsExpensesChart
              data={allSummaries}
              selectedMonth={selectedMonth}
              onSelectMonth={onSelectMonth}
            />
            <MonthByMonthSettingsModal
              excludeFirstMonth={excludeFirstMonth}
              excludeLastMonth={excludeLastMonth}
              open={settingsModalOpen}
              onClose={() => {
                setSettingsModalOpen(false);
              }}
              onSetExclusion={onSetExclusion}
            />
          </CollapsibleSection>
          <Breakdowns
            categoriesById={categoriesById}
            categoryGroupsById={categoryGroupsById}
            payeesById={payeesById}
            expenseTransactions={expenseTransactions}
            incomeTransactions={incomeTransactions}
            divideBy={showTotals ? 1 : summaries.length}
          />
        </Fragment>
      }
    />
  );
};

IncomeVsExpensesPage.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    months: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  historyAction: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired,
  onSetExclusion: PropTypes.func.isRequired
};

export default IncomeVsExpensesPage;
