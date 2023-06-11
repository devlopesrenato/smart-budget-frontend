import { Utils } from '@/utils/utils';
import React, { ChangeEvent, useState } from 'react';
import styles from './email-input.module.css';

interface EmailInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  alert: ErrorInputType;
  id: string
}

const _ = new Utils;

const EmailInput: React.FC<EmailInputProps> = ({
  placeholder,
  onChange,
  disabled = false,
  id,
  alert = {
    type: 'error',
    show: false,
    message: 'Email field error.'
  }
}) => {
  const [email, setEmail] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value)
    onChange(value)
  }

  return (
    <div>
      <input
        disabled={disabled}
        name={id}
        id={id}
        className={styles.input}
        type="email"
        placeholder={placeholder}
        onChange={handleInputChange}
        value={email}
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

export default EmailInput;
