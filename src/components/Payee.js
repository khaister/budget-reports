import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { getPayeesLink } from "../utils";
import PageWrapper from "./PageWrapper";
import PayeeBody from "./PayeeBody";

const Payee = ({
  authorized,
  budget,
  budgetId,
  payeeId,
  onAuthorize,
  onRequestBudget
}) => {
  const payee = get(["payeesById", payeeId])(budget);

  return (
    <PageWrapper
      authorized={authorized}
      budgetId={budgetId}
      budgetLoaded={!!budget}
      onAuthorize={onAuthorize}
      onRequestBudget={onRequestBudget}
      title={payee ? payee.name : ""}
      backLink={getPayeesLink({ budgetId })}
      content={() => <PayeeBody budget={budget} payee={payee} />}
    />
  );
};

Payee.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  payeeId: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Payee;
