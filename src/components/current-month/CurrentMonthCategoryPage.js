import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { getTransactionMonth } from '../../utils/budgetUtils';
import PageLayout from '../page/PageLayout';
import DayByDaySection from './DayByDaySection';
import TransactionsSection from './TransactionsSection';

const CurrentMonthCategoryPage = ({
  budget,
  currentMonth,
  categoryId,
  historyAction,
  location,
  sidebarTrigger,
  title
}) => {
  const {
    id: budgetId,
    payeesById,
    categoriesById,
    transactions: allTransactions
  } = budget;

  const category = categoriesById[categoryId];
  const transactionsInCategory = allTransactions.filter(
    transaction => transaction.category_id === categoryId
  );
  const transactionsInCategoryForMonth = transactionsInCategory.filter(
    transaction => getTransactionMonth(transaction) === currentMonth
  );

  const spent = -category.activity;
  const available = category.balance;

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      budget={budget}
      title={title}
      content={
        <Fragment>
          <DayByDaySection
            key={category ? category.name : 'day-by-day'}
            budgetId={budgetId}
            currentMonth={currentMonth}
            title='Day by Day'
            transactions={transactionsInCategory}
            total={spent + available}
          />
          <TransactionsSection
            categoriesById={categoriesById}
            payeesById={payeesById}
            transactions={transactionsInCategoryForMonth}
          />
        </Fragment>
      }
    />
  );
};

CurrentMonthCategoryPage.propTypes = {
  budget: PropTypes.shape({
    categories: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    payeesById: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired
  }).isRequired,
  categoryGroupId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  historyAction: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default CurrentMonthCategoryPage;
