import React, { useState, useEffect, ChangeEvent } from 'react';
import './index.css';

// 定义组件的 Props 类型
interface SelectComponentProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ value, options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onSelect) {
      onSelect(newValue);
    }
  };

  return (
    <select value={selectedValue} onChange={handleChange} className='port-select'>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectComponent;
