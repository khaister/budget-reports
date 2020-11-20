import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/fp/sortBy';
import sumBy from 'lodash/fp/sumBy';

import { getPayeeNodes } from '../../utils/budgetUtils';
import { AmountWithPercentage, Breakdown, CollapsibleSection } from '../common';

const IncomeBreakdown = ({ transactions, payeesById, divideBy }) => {
  const nodes = getPayeeNodes({ payeesById, transactions }, divideBy);
  const total = sumBy('amount')(nodes);
  return (
    <CollapsibleSection title='Income Breakdown'>
      <Breakdown
        nodes={sortBy('amount')(nodes).reverse()}
        total={total}
        valueRenderer={node => (
          <AmountWithPercentage {...node} expectPositive total={total} />
        )}
      />
    </CollapsibleSection>
  );
};

IncomeBreakdown.propTypes = {
  divideBy: PropTypes.number.isRequired,
  payeesById: PropTypes.objectOf(PropTypes.object).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

IncomeBreakdown.defaultProps = { divideBy: 1 };

export default IncomeBreakdown;
