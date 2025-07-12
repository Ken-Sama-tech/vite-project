import { useCallback, useEffect, useState } from 'react';
import settings from '../../lib/api/settings';

function SettingsEnum({
  name,
  label = 'Default',
  className = '',
  useAlias = false,
}) {
  //only works on settings and with enum options
  const [options, setOptions] = useState([]);
  const [activeValue, setActiveValue] = useState('');
  const [alias, setAlias] = useState(null);
  const [fields, setFields] = useState({});

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

      if (useAlias && data.alias.length) setAlias(new Map(data.alias));
      setFields({ ...data });
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
          ...fields,
          active: newValue,
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
        className={`text-white text-sm border border-white bg-transparent shrink-0 rounded-md uppercase ${className}`}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt} className="text-black w-full uppercase">
            {useAlias && alias ? alias.get(opt) : opt}
          </option>
        ))}
      </select>
    </>
  );
}

export default SettingsEnum;
