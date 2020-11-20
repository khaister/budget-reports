import React from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/fp/isNumber';

import { MinorText, LargeNumber } from '../common/typeComponents';
import { Amount } from '../common';

const ChartNumbers = ({ numbers, alwaysRound, expectPositive }) => {
  const smallNumbers = numbers.some(({ amount }) => Math.abs(amount) < 100);
  return (
    <div
      style={{
        textAlign: 'right',
        lineHeight: '16px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row-reverse',
        marginBottom: 8
      }}
    >
      {numbers.map(({ amount, label, isMoney = true, decimalsToRound }) => (
        <div key={label} style={{ marginLeft: 20 }}>
          <LargeNumber style={{ lineHeight: '16px' }}>
            <Amount
              amount={amount}
              amountAfterDecimal={
                isNumber(decimalsToRound)
                  ? decimalsToRound
                  : smallNumbers && !alwaysRound
                  ? 2
                  : 0
              }
              showCurrencySymbol={isMoney}
              expectNegative={!expectPositive}
              expectPositive={expectPositive}
            />
          </LargeNumber>
          <MinorText>{label}</MinorText>
        </div>
      ))}
    </div>
  );
};

ChartNumbers.propTypes = {
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      alwaysRound: PropTypes.bool,
      decimalsToRound: PropTypes.number,
      isMoney: PropTypes.bool
    })
  ).isRequired,
  alwaysRound: PropTypes.bool,
  expectPositive: PropTypes.bool
};

export default ChartNumbers;
