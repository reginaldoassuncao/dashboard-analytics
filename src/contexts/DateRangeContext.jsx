import { createContext, useContext, useReducer, useCallback } from 'react';
import { DateUtils } from '../utils/dateUtils';

const DateRangeContext = createContext();

// Initial state
const initialState = {
  selectedPeriod: '30d',
  customStartDate: null,
  customEndDate: null,
  isCustomPeriod: false,
  compareMode: false,
  comparePeriod: 'previous',
  isLoading: false,
  lastUpdate: Date.now(),
  isInitialized: false
};

// Action types
const actionTypes = {
  SET_QUICK_PERIOD: 'SET_QUICK_PERIOD',
  SET_CUSTOM_PERIOD: 'SET_CUSTOM_PERIOD',
  SET_COMPARE_MODE: 'SET_COMPARE_MODE',
  SET_COMPARE_PERIOD: 'SET_COMPARE_PERIOD',
  SET_LOADING: 'SET_LOADING',
  UPDATE_TIMESTAMP: 'UPDATE_TIMESTAMP'
};

// Reducer function
function dateRangeReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_QUICK_PERIOD:
      return {
        ...state,
        selectedPeriod: action.payload,
        isCustomPeriod: false,
        customStartDate: null,
        customEndDate: null,
        lastUpdate: Date.now()
      };
      
    case actionTypes.SET_CUSTOM_PERIOD:
      return {
        ...state,
        selectedPeriod: 'custom',
        isCustomPeriod: true,
        customStartDate: action.payload.startDate,
        customEndDate: action.payload.endDate,
        lastUpdate: Date.now()
      };
      
    case actionTypes.SET_COMPARE_MODE:
      return {
        ...state,
        compareMode: action.payload,
        lastUpdate: Date.now()
      };
      
    case actionTypes.SET_COMPARE_PERIOD:
      return {
        ...state,
        comparePeriod: action.payload,
        lastUpdate: Date.now()
      };
      
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case actionTypes.UPDATE_TIMESTAMP:
      return {
        ...state,
        lastUpdate: Date.now()
      };
      
    default:
      return state;
  }
}

// Context provider component
export function DateRangeProvider({ children }) {
  const [state, dispatch] = useReducer(dateRangeReducer, initialState);

  // Action creators
  const setQuickPeriod = useCallback((period) => {
    dispatch({ type: actionTypes.SET_QUICK_PERIOD, payload: period });
  }, []);

  const setCustomPeriod = useCallback((startDate, endDate) => {
    dispatch({ 
      type: actionTypes.SET_CUSTOM_PERIOD, 
      payload: { startDate, endDate } 
    });
  }, []);

  const setCompareMode = useCallback((enabled) => {
    dispatch({ type: actionTypes.SET_COMPARE_MODE, payload: enabled });
  }, []);

  const setComparePeriod = useCallback((period) => {
    dispatch({ type: actionTypes.SET_COMPARE_PERIOD, payload: period });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const updateTimestamp = useCallback(() => {
    dispatch({ type: actionTypes.UPDATE_TIMESTAMP });
  }, []);

  // Computed values
  const getDateRange = useCallback(() => {
    if (state.isCustomPeriod && state.customStartDate && state.customEndDate) {
      return {
        startDate: new Date(state.customStartDate),
        endDate: new Date(state.customEndDate),
        type: 'custom'
      };
    }

    const today = new Date();
    let startDate;
    let days;

    switch (state.selectedPeriod) {
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
      case '1y':
        days = 365;
        break;
      default:
        days = 30;
    }

    startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);

    return {
      startDate,
      endDate: today,
      days,
      type: 'quick'
    };
  }, [state.selectedPeriod, state.isCustomPeriod, state.customStartDate, state.customEndDate]);

  const getComparisonDateRange = useCallback(() => {
    const currentRange = getDateRange();
    const duration = currentRange.endDate.getTime() - currentRange.startDate.getTime();
    
    let comparisonStartDate;
    let comparisonEndDate;

    switch (state.comparePeriod) {
      case 'previous':
        comparisonEndDate = new Date(currentRange.startDate.getTime() - 1);
        comparisonStartDate = new Date(comparisonEndDate.getTime() - duration);
        break;
      case 'year_ago':
        comparisonStartDate = new Date(currentRange.startDate);
        comparisonStartDate.setFullYear(comparisonStartDate.getFullYear() - 1);
        comparisonEndDate = new Date(currentRange.endDate);
        comparisonEndDate.setFullYear(comparisonEndDate.getFullYear() - 1);
        break;
      default:
        comparisonEndDate = new Date(currentRange.startDate.getTime() - 1);
        comparisonStartDate = new Date(comparisonEndDate.getTime() - duration);
    }

    return {
      startDate: comparisonStartDate,
      endDate: comparisonEndDate,
      type: 'comparison'
    };
  }, [getDateRange, state.comparePeriod]);

  const getPeriodLabel = useCallback(() => {
    if (state.isCustomPeriod && state.customStartDate && state.customEndDate) {
      const start = DateUtils.formatDate(state.customStartDate, 'dd/mm/yyyy');
      const end = DateUtils.formatDate(state.customEndDate, 'dd/mm/yyyy');
      return `${start} - ${end}`;
    }

    return DateUtils.getPeriodLabel(state.selectedPeriod);
  }, [state.selectedPeriod, state.isCustomPeriod, state.customStartDate, state.customEndDate]);

  const value = {
    // State
    ...state,
    
    // Actions
    setQuickPeriod,
    setCustomPeriod,
    setCompareMode,
    setComparePeriod,
    setLoading,
    updateTimestamp,
    
    // Computed values
    getDateRange,
    getComparisonDateRange,
    getPeriodLabel
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

// Custom hook to use the date range context
export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
}

// Quick filter presets
export const QUICK_FILTERS = [
  { key: '7d', label: '7 dias', days: 7 },
  { key: '30d', label: '30 dias', days: 30 },
  { key: '90d', label: '90 dias', days: 90 },
  { key: '1y', label: '1 ano', days: 365 }
];

// Comparison options
export const COMPARISON_OPTIONS = [
  { key: 'previous', label: 'Período anterior' },
  { key: 'year_ago', label: 'Mesmo período ano passado' }
];