import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
        style={{ display: 'none' }}
      />
      <span
        style={{
          width: '52px',
          height: '28px',
          backgroundColor: isDarkMode ? '#5C5242' : '#ccc',
          borderRadius: '28px',
          position: 'relative',
          transition: 'background-color 0.3s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: isDarkMode ? '27px' : '3px',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            transition: 'left 0.3s',
          }}
        />
      </span>
      <span style={{ marginLeft: '10px' }}>Dark Mode</span>
    </label>
  );
};

export default ThemeToggle;


