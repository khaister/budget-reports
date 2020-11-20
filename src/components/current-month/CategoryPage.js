import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { GenericEntitiesSection, MonthByMonthSection, TransactionsByMonthSection } from '../common';
import PageLayout from '../page/PageLayout';
import { getTransactionMonth, sanitizeName } from '../../utils/budgetUtils';
import pages, { makeLink } from '../../pages';

const CategoryPage = ({
  categoryId,
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  historyAction,
  location,
  months,
  selectedMonth,
  selectedPayeeId,
  sidebarTrigger,
  title,
  transactions,
  onSelectMonth,
  onSelectPayee,
  onSetExclusion
}) => {
  const { categoriesById, payeesById, id: budgetId } = budget;
  const category = categoriesById[categoryId];
  const selectedPayee = selectedPayeeId && payeesById[selectedPayeeId];
  const transactionsForCategory = transactions.filter(
    transaction => transaction.category_id === categoryId
  );
  const transactionsForMonth =
    selectedMonth &&
    transactionsForCategory.filter(
      transaction => getTransactionMonth(transaction) === selectedMonth
    );

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      budget={budget}
      title={title}
      content={
        <Fragment>
          <MonthByMonthSection
            excludeFirstMonth={excludeFirstMonth}
            excludeLastMonth={excludeLastMonth}
            months={months}
            onSetExclusion={onSetExclusion}
            highlightFunction={
              selectedPayeeId &&
              (transaction => transaction.payee_id === selectedPayeeId)
            }
            selectedMonth={selectedMonth}
            title={
              selectedPayee
                ? `Month by Month: ${sanitizeName(selectedPayee.name)}`
                : 'Month by Month'
            }
            transactions={transactionsForCategory}
            onSelectMonth={onSelectMonth}
          />
          <GenericEntitiesSection
            key={`payees-${selectedMonth || 'all'}`}
            emptyName='(no payee)'
            entitiesById={payeesById}
            entityKey='payee_id'
            expectNegative
            linkFunction={payeeId =>
              makeLink(pages.categoryPayee.path, {
                budgetId,
                categoryGroupId: category.category_group_id,
                categoryId: categoryId,
                payeeId
              })
            }
            title={
              selectedMonth
                ? `Payees: ${moment(selectedMonth).format('MMMM')}`
                : 'Payees'
            }
            transactions={transactionsForMonth || transactionsForCategory}
            selectedEntityId={selectedPayeeId}
            onClickEntity={onSelectPayee}
            limitShowing
          />
          {selectedMonth &&
            transactionsForMonth.length > 0 && (
              <TransactionsByMonthSection
                key={`transactions-${selectedMonth ||
                  'all'}-${selectedPayeeId || 'all'}`}
                categoriesById={categoriesById}
                payeesById={payeesById}
                transactions={transactionsForMonth}
                selectedMonth={selectedMonth}
                selectedPayeeId={selectedPayeeId}
              />
            )}
        </Fragment>
      }
    />
  );
};

CategoryPage.propTypes = {
  budget: PropTypes.shape({
    categoriesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        payee_id: PropTypes.string
      })
    ).isRequired,
    payeesById: PropTypes.object.isRequired
  }).isRequired,
  categoryId: PropTypes.string.isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  historyAction: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSelectPayee: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string,
  selectedPayeeId: PropTypes.string
};

export default CategoryPage;
