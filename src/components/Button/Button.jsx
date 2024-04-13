import styles from "./Button.module.css";

export const Button = (props) => {
  const { onClick, children } = props;

  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {children}
    </button>
  );
};
