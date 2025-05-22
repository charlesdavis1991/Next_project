
import React, { useEffect } from 'react';
import {useFormContext } from 'react-hook-form';
import check from './check.png'

function NotificationsModal({ notificationCurrent }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const pinned_case_activity = watch('pinned_case_activity')

  return (
    <>
      <div className="radio-container">
        <div className='home-form-container'>
          <div className="notification-toggle">
            <span>Notifications For Pinned Case Activity On Home Page</span>
            <div
              className={`checkbox-container ${pinned_case_activity ? 'checked' : ''}`}
              onClick={() => setValue('pinned_case_activity', !pinned_case_activity)}
            >
              <input
                type="checkbox"
                {...register('pinned_case_activity')}
                className="checkbox-input"
              />
              {pinned_case_activity &&
                <span className="check-icon"
                  style={{ height: '15px', width: '15px' }}
                >
                  <img
                    src={check} alt='check'
                  />
                </span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationsModal