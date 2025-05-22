import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

function PageViewModal({
  simpleViewCurrent,
  fullViewCurrent,
  datesViewCurrent,
  summaryViewCurrent,
  defFullViewCurrent,
}) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDefendant, setSelectedDefendant] = useState(null);

  useEffect(() => {
    if (simpleViewCurrent) {
      setSelectedProvider('simple')
      setValue('ProviderSimple', true);
      setValue('ProviderFull', false);
      setValue('ProviderDates', false);
    } else if (fullViewCurrent) {
      setSelectedProvider('full')
      setValue('ProviderFull', true);
      setValue('ProviderSimple', false);
      setValue('ProviderDates', false);
    } else if (datesViewCurrent) {
      setSelectedProvider('dates')
      setValue('ProviderDates', true);
      setValue('ProviderSimple', false);
      setValue('ProviderFull', false);
    }

    if (summaryViewCurrent) {
      setSelectedDefendant('summary')
      setValue('DefSummary', true);
      setValue('DefFull', false);
    } else if (defFullViewCurrent) {
      setSelectedDefendant('full')
      setValue('DefFull', true);
      setValue('DefSummary', false);
    }
  }, [
    simpleViewCurrent,
    fullViewCurrent,
    datesViewCurrent,
    summaryViewCurrent,
    defFullViewCurrent,
    setValue,
  ]);

  const handleProviderChange = (view) => {
    setSelectedProvider(view);
    setValue('ProviderSimple', view === 'simple');
    setValue('ProviderFull', view === 'full');
    setValue('ProviderDates', view === 'dates');
  };

  const handleDefendantChange = (view) => {
    setSelectedDefendant(view);
    setValue('DefSummary', view === 'summary');
    setValue('DefFull', view === 'full');
  };

  return (
    <>
      <div className="two-radio-groups">
        <div className="radio-buttons-container-2">
          <div className="d-flex radio-buttons">
            <div className="radio-group">
              <h4>Provider</h4>
              <div
                className={`radio-option ${selectedProvider === 'simple' ? 'selected' : ''}`}
                onClick={() => handleProviderChange('simple')}
              >
                <input
                  type="radio"
                  value="simple"
                  {...register('ProviderSimple')}
                  className="radio-input"
                />
                <div className={`radio-circle ${selectedProvider === 'simple' ? 'checked' : ''}`}></div>
                <span>Simple View</span>
              </div>

              <div
                className={`radio-option ${selectedProvider === 'full' ? 'selected' : ''}`}
                onClick={() => handleProviderChange('full')}
              >
                <input
                  type="radio"
                  value="full"
                  {...register('ProviderFull')}
                  className="radio-input"
                />
                <div className={`radio-circle ${selectedProvider === 'full' ? 'checked' : ''}`}></div>
                <span>Full View</span>
              </div>

              <div
                className={`radio-option ${selectedProvider === 'dates' ? 'selected' : ''}`}
                onClick={() => handleProviderChange('dates')}
              >
                <input
                  type="radio"
                  value="dates"
                  {...register('ProviderDates')}
                  className="radio-input"
                />
                <div className={`radio-circle ${selectedProvider === 'dates' ? 'checked' : ''}`}></div>
                <span>Dates View</span>
              </div>
            </div>
          </div>

          <div className="d-flex radio-buttons">
            <div className="radio-group">
              <h4>Defendant Page</h4>
              <div
                className={`radio-option ${selectedDefendant === 'summary' ? 'selected' : ''}`}
                onClick={() => handleDefendantChange('summary')}
              >
                <input
                  type="radio"
                  value="summary"
                  {...register('DefSummary')}
                  className="radio-input"
                />
                <div className={`radio-circle ${selectedDefendant === 'summary' ? 'checked' : ''}`}></div>
                <span>Summary View</span>
              </div>

              <div
                className={`radio-option ${selectedDefendant === 'full' ? 'selected' : ''}`}
                onClick={() => handleDefendantChange('full')}
              >
                <input
                  type="radio"
                  value="full"
                  {...register('DefFull')}
                  className="radio-input"
                />
                <div className={`radio-circle ${selectedDefendant === 'full' ? 'checked' : ''}`}></div>
                <span>Full View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageViewModal;
