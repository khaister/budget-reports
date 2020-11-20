import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import {
  positiveColor as green,
  negativeColor as red
} from "../../styleVariables";
import CurrencyContext from "./CurrencyContext";

export const addCommas = nStr => {
  nStr += "";

  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1,$2");
  }
  return x1 + x2;
};

const Amount = ({
  amount,
  amountAfterDecimal,
  expectNegative,
  expectPositive,
  showCurrencySymbol,
  style
}) => (
  <CurrencyContext.Consumer>
    {currencyFormat => (
      <span
        style={{
          ...style,
          color:
            amount === 0
              ? null
              : amount > 0
              ? expectPositive
                ? null
                : green
              : expectNegative
              ? null
              : red
        }}
      >
        {amount === 0
          ? null
          : amount > 0
          ? expectPositive
            ? null
            : "+"
          : expectNegative
          ? null
          : "-"}
        {showCurrencySymbol && (get("symbol")(currencyFormat) || "$")}
        {addCommas(Math.abs(amount).toFixed(amountAfterDecimal))}
      </span>
    )}
  </CurrencyContext.Consumer>
);

Amount.propTypes = {
  amount: PropTypes.number.isRequired,
  amountAfterDecimal: PropTypes.number,
  expectNegative: PropTypes.bool,
  expectPositive: PropTypes.bool,
  showCurrencySymbol: PropTypes.bool,
  style: PropTypes.object
};

Amount.defaultProps = {
  amountAfterDecimal: 2
};

export default Amount;
