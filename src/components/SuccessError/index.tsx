import { Utils } from '@/utils/utils';
import { Result } from 'antd';
import Link from 'next/link';
import styles from './succes.error.module.css';

interface SuccessErrorProps {
  type: 'error' | 'success' | 'info';
  title: string;
  subTitle: string;
  buttonTitle?: string,
  buttonLink?: string,
  buttonOnClick?: () => void
}

const _ = new Utils();

const SuccessError: React.FC<SuccessErrorProps> = ({ type, subTitle, title, buttonTitle = 'Página Inicial', buttonLink = '/', buttonOnClick }) => {

  return (
    <div className={styles.center}>
      <Result
        status={type}
        title={<span key='title' className={styles.title}>{title}</span>}
        subTitle={<span key='subTitle' className={styles.title}>{subTitle}</span>}
        extra={[
          <Link
            key="linkButton"
            href={buttonLink}
          >
            <button
              className={styles.button}
              onClick={buttonOnClick}
            >
              {buttonTitle}
            </button>
          </Link>
        ]}
      />
    </div>
  );
};

export default SuccessError;

