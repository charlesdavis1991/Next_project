import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

function CalendarViewModal({
  todayCurrent,
  timelineCurrent,
  weekCurrent,
  monthCurrent,
  lastAccessCurrent,
}) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
      } = useFormContext();
    

  const [selectedView, setSelectedView] = useState('');

  const CalTimeline = watch('CalTimeline');
  const CalToday = watch('CalToday');
  const CalCurWeek = watch('CalCurWeek');
  const CalCurMo = watch('CalCurMo');
  const CalLastView = watch('CalLastView');

  useEffect(() => {
    if (timelineCurrent) {
      setValue('CalTimeline', true);
      setSelectedView('CalTimeline');
    }

    if (todayCurrent) {
      setValue('CalToday', true);
      setSelectedView('CalToday');
    }

    if (weekCurrent) {
      setValue('CalCurWeek', true);
      setSelectedView('CalCurWeek');
    }

    if (monthCurrent) {
      setValue('CalCurMo', true);
      setSelectedView('CalCurMo');
    }

    if (lastAccessCurrent) {
      setValue('CalLastView', true);
      setSelectedView('CalLastView');
    }
  }, [todayCurrent, timelineCurrent, weekCurrent, monthCurrent, lastAccessCurrent, setValue]);

  const handleViewChange = (field) => {
    setSelectedView(field);
    // Reset all values to false before setting the selected one to true
    setValue('CalTimeline', field === 'CalTimeline');
    setValue('CalToday', field === 'CalToday');
    setValue('CalCurWeek', field === 'CalCurWeek');
    setValue('CalCurMo', field === 'CalCurMo');
    setValue('CalLastView', field === 'CalLastView');
  };

  return (
    <>
      <div className="two-radio-groups">
        <div className='radio-buttons-container-2'>
          <div className='d-flex radio-buttons'>
            <div className="radio-group">
              <div
                className={`radio-option ${selectedView === 'CalTimeline' ? 'selected' : ''}`}
                onClick={() => handleViewChange('CalTimeline')}
              >
                <input
                  type="radio"
                  value="CalTimeline"
                  {...register('CalTimeline')}
                  className="radio-input"
                />
                <div className={`radio-circle ${CalTimeline ? 'checked' : ''}`}></div>
                <span>Timeline</span>
              </div>

              <div
                className={`radio-option ${selectedView === 'CalToday' ? 'selected' : ''}`}
                onClick={() => handleViewChange('CalToday')}
              >
                <input
                  type="radio"
                  value="CalToday"
                  {...register('CalToday')}
                  className="radio-input"
                />
                <div className={`radio-circle ${CalToday ? 'checked' : ''}`}></div>
                <span>Today</span>
              </div>

              <div
                className={`radio-option ${selectedView === 'CalCurWeek' ? 'selected' : ''}`}
                onClick={() => handleViewChange('CalCurWeek')}
              >
                <input
                  type="radio"
                  value="CalCurWeek"
                  {...register('CalCurWeek')}
                  className="radio-input"
                />
                <div className={`radio-circle ${CalCurWeek ? 'checked' : ''}`}></div>
                <span>Current Week</span>
              </div>
            </div>
          </div>

          <div className='d-flex radio-buttons'>
            <div className="radio-group">
              <div
                className={`radio-option ${selectedView === 'CalCurMo' ? 'selected' : ''}`}
                onClick={() => handleViewChange('CalCurMo')}
              >
                <input
                  type="radio"
                  value="CalCurMo"
                  {...register('CalCurMo')}
                  className="radio-input"
                />
                <div className={`radio-circle ${CalCurMo ? 'checked' : ''}`}></div>
                <span>Current Month</span>
              </div>

              <div
                className={`radio-option ${selectedView === 'CalLastView' ? 'selected' : ''}`}
                onClick={() => handleViewChange('CalLastView')}
              >
                <input
                  type="radio"
                  value="CalLastView"
                  {...register('CalLastView')}
                  className="radio-input"
                />
                <div className={`radio-circle ${CalLastView ? 'checked' : ''}`}></div>
                <span>Last Accessed View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarViewModal;
