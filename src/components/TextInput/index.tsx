import { Utils } from '@/utils/utils';
import React, { ChangeEvent, useState } from 'react';
import styles from './text-input.module.css';

interface TextInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  alert: ErrorInputType;
  id: string
}

const _ = new Utils;

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  onChange,
  disabled = false,
  id,
  alert = {
    type: 'error',
    show: false,
    message: 'Text field error.'
  }
}) => {
  const [text, setText] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value)
    onChange(value)
  }

  return (
    <div>
      <input
        disabled={disabled}
        name={id}
        id={id}
        className={styles.input}
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        value={text}
        style={{
          border:
            alert.show
              ? (
                alert.type === 'error'
                  ? '1px solid #ff4d4f'
                  : '1px solid #e4a01b'
              )
              : 'none'
        }}
      />
      <p
        className={styles.alert}
        style={{
          display: alert.show ? 'flex' : 'none',
          color: alert.type === 'error' ? '#ff4d4f' : '#e4a01b',
        }}
      >
        {alert.message}
      </p>
    </div>
  )
};

export default TextInput;
