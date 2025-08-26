import { useState } from 'react';
import { Calendar, ChevronDown, RotateCcw, TrendingUp } from 'lucide-react';
import { useDateRange, QUICK_FILTERS, COMPARISON_OPTIONS } from '../../contexts/DateRangeContext';
import { DateUtils } from '../../utils/dateUtils';
import styles from './DateFilters.module.css';

function DateFilters() {
  const {
    selectedPeriod,
    isCustomPeriod,
    customStartDate,
    customEndDate,
    compareMode,
    comparePeriod,
    isLoading,
    setQuickPeriod,
    setCustomPeriod,
    setCompareMode,
    setComparePeriod,
    getPeriodLabel,
    updateTimestamp
  } = useDateRange();

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [showCompareOptions, setShowCompareOptions] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const handleQuickFilterClick = (periodKey) => {
    setQuickPeriod(periodKey);
    setShowCustomPicker(false);
  };

  const handleCustomDateSubmit = () => {
    if (tempStartDate && tempEndDate) {
      const startDate = new Date(tempStartDate);
      const endDate = new Date(tempEndDate);
      
      if (startDate <= endDate) {
        setCustomPeriod(tempStartDate, tempEndDate);
        setShowCustomPicker(false);
      }
    }
  };

  const handleCustomPickerToggle = () => {
    if (!showCustomPicker) {
      const today = new Date();
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      
      setTempStartDate(DateUtils.formatDate(monthAgo));
      setTempEndDate(DateUtils.formatDate(today));
    }
    setShowCustomPicker(!showCustomPicker);
  };

  const handleRefresh = () => {
    updateTimestamp();
  };

  return (
    <div className={styles.container}>
      <div className={styles.filtersRow}>
        {/* Quick Filters */}
        <div className={styles.quickFilters}>
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`${styles.quickFilter} ${
                selectedPeriod === filter.key && !isCustomPeriod ? styles.active : ''
              }`}
              onClick={() => handleQuickFilterClick(filter.key)}
              disabled={isLoading}
            >
              {filter.label}
            </button>
          ))}
          
          <button
            className={`${styles.quickFilter} ${styles.customButton} ${
              isCustomPeriod ? styles.active : ''
            }`}
            onClick={handleCustomPickerToggle}
            disabled={isLoading}
          >
            <Calendar size={14} />
            Personalizado
            <ChevronDown 
              size={12} 
              className={`${styles.chevron} ${showCustomPicker ? styles.chevronUp : ''}`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.compareButton} ${
              compareMode ? styles.active : ''
            }`}
            onClick={() => setShowCompareOptions(!showCompareOptions)}
            disabled={isLoading}
          >
            <TrendingUp size={14} />
            Comparar
            <ChevronDown 
              size={12} 
              className={`${styles.chevron} ${showCompareOptions ? styles.chevronUp : ''}`}
            />
          </button>

          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isLoading}
            title="Atualizar dados"
          >
            <RotateCcw size={14} className={isLoading ? styles.spinning : ''} />
          </button>
        </div>
      </div>

      {/* Custom Date Picker */}
      {showCustomPicker && (
        <div className={styles.customPicker}>
          <div className={styles.pickerHeader}>
            <h4>Período Personalizado</h4>
          </div>
          <div className={styles.pickerContent}>
            <div className={styles.dateInputGroup}>
              <label>Data inicial</label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.dateInputGroup}>
              <label>Data final</label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>
          <div className={styles.pickerActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setShowCustomPicker(false)}
            >
              Cancelar
            </button>
            <button
              className={styles.applyButton}
              onClick={handleCustomDateSubmit}
              disabled={!tempStartDate || !tempEndDate}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Compare Options */}
      {showCompareOptions && (
        <div className={styles.compareOptions}>
          <div className={styles.compareHeader}>
            <label className={styles.compareToggle}>
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
              Ativar comparação
            </label>
          </div>
          
          {compareMode && (
            <div className={styles.compareContent}>
              {COMPARISON_OPTIONS.map((option) => (
                <label key={option.key} className={styles.compareOption}>
                  <input
                    type="radio"
                    name="comparePeriod"
                    value={option.key}
                    checked={comparePeriod === option.key}
                    onChange={(e) => setComparePeriod(e.target.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Period Info */}
      <div className={styles.periodInfo}>
        <span className={styles.currentPeriod}>
          📅 {getPeriodLabel()}
        </span>
        {compareMode && (
          <span className={styles.compareInfo}>
            🔄 Comparando com {COMPARISON_OPTIONS.find(opt => opt.key === comparePeriod)?.label.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
}

export default DateFilters;