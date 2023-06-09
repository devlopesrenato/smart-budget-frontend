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
      />
      <p
        className={styles.alert}
        style={{
          display: alert.show ? 'flex' : 'none',
          color: alert.type === 'error' ? 'red' : 'yellow',
        }}
      >
        {alert.message}
      </p>
    </div>
  )
};

export default EmailInput;
