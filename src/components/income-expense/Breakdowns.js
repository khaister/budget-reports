import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { sumByProp } from "../../utils/dataUtils";
import ExpensesBreakdown from "./ExpensesBreakdown";
import IncomeBreakdown from "./IncomeBreakdown";

const Breakdowns = ({
  categoriesById,
  categoryGroupsById,
  payeesById,
  expenseTransactions,
  incomeTransactions,
  divideBy
}) => (
  <Fragment>
    <ExpensesBreakdown
      categoriesById={categoriesById}
      categoryGroupsById={categoryGroupsById}
      payeesById={payeesById}
      transactions={expenseTransactions}
      totalIncome={sumByProp("amount")(incomeTransactions) / divideBy}
      divideBy={divideBy}
    />
    <IncomeBreakdown
      payeesById={payeesById}
      transactions={incomeTransactions}
      divideBy={divideBy}
    />
  </Fragment>
);

Breakdowns.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  categoryGroupsById: PropTypes.object.isRequired,
  expenseTransactions: PropTypes.array.isRequired,
  incomeTransactions: PropTypes.array.isRequired,
  payeesById: PropTypes.object.isRequired,
  divideBy: PropTypes.number.isRequired
};

export default Breakdowns;
