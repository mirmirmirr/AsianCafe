import React, { useState } from 'react';

const CustomTimePicker = ({ value, onChange }) => {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [amPm, setAmPm] = useState('AM');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const handleTimeSelect = () => {
    const formattedHours = amPm === 'PM' && hours !== 12 ? hours + 12 : hours;
    const formattedTime = `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onChange(formattedTime);
    setShowTimeDropdown(false);
  };

  const formattedDisplayTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${amPm}`;

  return (
    <div className="relative">
      <input
        type="text"
        value={formattedDisplayTime}
        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
        readOnly
        className="custom-time-input w-full border border-gray-300 p-2 rounded cursor-pointer"
      />
      {showTimeDropdown && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full p-4">
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Hours</label>
              <div className='max-h-[200px] overflow-y-auto scrollbar-none'>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i % 12 || 12;
                  const formattedHour = String(hour).padStart(2, '0');
                  const period = i < 12 ? 'AM' : 'PM';
                  return (
                    <div
                      key={formattedHour + period}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setHours(hour);
                        setAmPm(period);
                      }}
                    >
                      {formattedHour}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Minutes</label>
              <div className='max-h-[200px] overflow-y-auto scrollbar-none'>
                {Array.from({ length: 60 }, (_, i) => {
                  const formattedMin = String(i).padStart(2, '0');
                  return (
                    <div
                      key={formattedMin}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setMinutes(i);
                      }}
                    >
                      {formattedMin}
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAmPm(amPm === 'AM' ? 'PM' : 'AM')}
              className="bg-gray-200 p-2 rounded"
            >
              {amPm}
            </button>
          </div>
          <button
            type="button"
            onClick={handleTimeSelect}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Set Time
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;
