import styles from './button.module.css';

interface ButtonProps {
    title: string | JSX.Element;
    onClick?: () => void;
    disabled?: boolean;
    visible?: boolean;
    type: 'submit' | 'button' | 'reset' | undefined;
    width?: string;
    minWidth?: string;
    maxWidth?: string;

}

export const Button: React.FC<ButtonProps> = ({
    title = '',
    onClick,
    disabled = false,
    visible = true,
    type = undefined,
    width = '100%',
    minWidth,
    maxWidth,
}) => {

    return (
        <button
            style={{
                display: visible ? 'flex' : 'none',
                width,
                maxWidth,
                minWidth
            }}
            type={type}
            disabled={disabled}
            className={styles.button}
            onClick={() => {
                if (onClick) {
                    onClick()
                }
            }}
        >
            {title}
        </button>
    )
}