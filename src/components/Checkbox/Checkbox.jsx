import styles from "./Checkbox.module.css";
import {
  Icon24CheckBoxIndeterminate,
  Icon24CheckBoxOff,
  Icon24CheckBoxOn,
} from "@vkontakte/icons";

export const Checkbox = (props) => {
  const { checked } = props;

  return (
    <div>
      {checked && <Icon24CheckBoxOn className={styles.checked} />}
      {checked === null && (
        <Icon24CheckBoxIndeterminate className={styles.checked} />
      )}
      {checked === false && <Icon24CheckBoxOff />}
    </div>
  );
};
