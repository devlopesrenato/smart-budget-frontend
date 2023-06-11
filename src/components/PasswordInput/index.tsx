import { Utils } from '@/utils/utils';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import styles from './password-input.module.css';

interface PasswordInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  alert: ErrorInputType;
  id: string
}

const _ = new Utils();

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  onChange,
  disabled = false,
  id,
  alert = {
    type: 'error',
    show: false,
    message: 'Password field error.'
  }
}) => {
  const [view, setView] = useState(false);
  const [pass, setPass] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPass(value);
    onChange(value)
  };

  return (
    <div>
      <div
        className={styles.inputContainer}
      >
        <input          
          disabled={disabled}
          name={id}
          id={id}
          className={styles.input}
          type={view ? 'text' : 'password'}
          placeholder={placeholder}
          onChange={handleInputChange}
          value={pass}
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
        {view ? (
          <AiFillEyeInvisible
            size={'1.3rem'}
            className={styles.icon}
            onClick={() => setView(false)}
          />
        ) : (
          <AiFillEye
            size={'1.3rem'}
            className={styles.icon}
            onClick={() => setView(true)}
          />
        )}
      </div>
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
  );
};

export default PasswordInput;

