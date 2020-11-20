import get from "lodash/get";

import { getStorage, setStorage } from "../utils/localstorageUtils";

const SETTINGS = {
  excludeFirstMonth: {
    localStorageKey: "budget-reports-exclude-first-month",
    default: false
  },
  excludeLastMonth: {
    localStorageKey: "budget-reports-exclude-last-month",
    default: false
  },
  investmentAccounts: {
    localStorageKey: "budget-reports-investment-accounts",
    default: {}
  },
  lastUpdated: {
    localStorageKey: "budget-reports-last-updated",
    default: null
  },
  mortgageAccounts: {
    localStorageKey: "budget-reports-mortgage-accounts",
    default: {}
  },
  netWorthHiddenAccounts: {
    localStorageKey: "budget-reports-networth-hidden-accounts",
    default: {}
  },
  spendingMonthsToCompare: {
    localStorageKey: "budget-reports-spending-months-to-compare",
    default: 3
  },
  trendsShowAverage: {
    localStorageKey: "budget-reports-trends-show-average",
    default: true
  }
};

export const getSetting = (settingsKey, budgetId) => {
  const setting = SETTINGS[settingsKey];

  if (!setting) {
    throw new Error("not a valid settings key");
  }

  return get(getStorage(setting.localStorageKey), budgetId, setting.default);
};

export const setSetting = (settingsKey, budgetId, value) => {
  const setting = SETTINGS[settingsKey];

  if (!setting) {
    throw new Error("not a valid settings key");
  }

  const previousSetting = getStorage(setting.localStorageKey);

  setStorage(setting.localStorageKey, {
    ...previousSetting,
    [budgetId]: value
  });
};
