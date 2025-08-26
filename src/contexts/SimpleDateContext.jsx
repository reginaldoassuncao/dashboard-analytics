import { createContext, useContext, useState, useCallback } from 'react';

const SimpleDateContext = createContext();

export function SimpleDateProvider({ children }) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [compareMode, setCompareMode] = useState(false);
  
  const contextValue = {
    selectedPeriod,
    setSelectedPeriod,
    compareMode,
    setCompareMode,
    getPeriodLabel: useCallback(() => {
      const labels = {
        '7d': '7 dias',
        '30d': '30 dias', 
        '90d': '90 dias',
        '1y': '1 ano'
      };
      return labels[selectedPeriod] || selectedPeriod;
    }, [selectedPeriod])
  };

  return (
    <SimpleDateContext.Provider value={contextValue}>
      {children}
    </SimpleDateContext.Provider>
  );
}

export function useSimpleDateRange() {
  const context = useContext(SimpleDateContext);
  if (!context) {
    throw new Error('useSimpleDateRange must be used within SimpleDateProvider');
  }
  return context;
}