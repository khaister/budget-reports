import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import range from 'lodash/fp/range';

import { groupByProp } from '../../utils/dataUtils';
import { CollapsibleSection } from '../common';
import DateSummary from './DateSummary';

const NUM_DAYS = 5;

const RecentSpending = ({
  categoriesById,
  currentMonth,
  payeesById,
  transactions
}) => {
  const transactionsByDate = groupByProp('date')(transactions);
  const recentDays = range(0, NUM_DAYS)
    .map(n =>
      moment()
        .subtract(n, 'days')
        .format('YYYY-MM-DD')
    )
    .filter(date => date.startsWith(currentMonth));

  const [expanded, setExpanded] = useState(
    recentDays.reduce((acc, date) => ({ ...acc, [date]: false }), {})
  );

  return (
    <CollapsibleSection title='Recent Spending'>
      {recentDays.map(date => (
        <DateSummary
          key={date}
          categoriesById={categoriesById}
          date={date}
          expanded={!!expanded[date]}
          onToggleExpanded={() => {
            setExpanded({ ...expanded, [date]: !expanded[date] });
          }}
          payeesById={payeesById}
          transactions={transactionsByDate[date] || []}
        />
      ))}
    </CollapsibleSection>
  );
};

RecentSpending.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  currentMonth: PropTypes.string.isRequired,
  payeesById: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default RecentSpending;
