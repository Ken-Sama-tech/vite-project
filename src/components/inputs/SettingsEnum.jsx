import { useCallback, useEffect, useState } from 'react';
import settings from '../../lib/api/settings';

function SettingsEnum({ name, label = 'Default', className = '' }) {
  //only works on settings and with enum options
  const [options, setOptions] = useState([]);
  const [activeValue, setActiveValue] = useState('');

  useEffect(() => {
    settings.get(name, (res) => {
      const { data, error } = res;

      if (error) {
        console.error('Error', res);
        return;
      }

      if (!data?.enum) {
        console.error('Error', `"${name} is not a valid enum"`);
        return;
      }

      setOptions(data.enum);
      setActiveValue(data.active);
    });
  }, []);

  const updateSettings = useCallback(
    (newValue) => {
      if (options.length <= 0) return;
      const field = name;
      const obj = {
        [field]: {
          active: newValue,
          enum: options,
        },
      };

      settings.patch(obj, (res) => {
        const { message, error } = res;
        if (error) {
          console.error('Error', res);
          return;
        }

        console.log(
          'message:',
          `${message}. Refresh the page to apply changes`
        );
      });
    },
    [options]
  );

  return (
    <>
      <label htmlFor={name} className="text-white cursor-pointer">
        {label}
      </label>
      <select
        id={name}
        value={activeValue}
        onChange={(e) => {
          setActiveValue(e.target.value);
          updateSettings(e.target.value);
        }}
        className={`text-white text-sm border border-white bg-transparent shrink-0 rounded-md ${className}`}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt} className="text-black w-full">
            {opt}
          </option>
        ))}
      </select>
    </>
  );
}

export default SettingsEnum;
