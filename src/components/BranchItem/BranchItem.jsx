import styles from "./BranchItem.module.css";
import { IconButton, classNames as cn, SimpleCell } from "@vkontakte/vkui";
import {
  Icon20ChevronRightOutline,
  Icon16DropdownOutline,
} from "@vkontakte/icons";
import { Checkbox } from "../Checkbox/Checkbox.jsx";

export const BranchItem = (props) => {
  const { expanded, item, toggleExpand, onChange, status } = props;

  const checkStatusToValueMap = {
    checked: true,
    unchecked: false,
    indeterminate: null,
  };

  const handleChange = () => {
    onChange?.(item.id);
  };

  return (
    <div
      className={cn(styles.branch, { [styles.leaf]: !item.categories?.length })}
      key={item.id}
    >
      {expanded !== undefined &&
        typeof toggleExpand === "function" &&
        Boolean(item.categories?.length) && (
          <IconButton
            aria-label="Close"
            className={styles.toggler}
            onClick={toggleExpand}
            hasActive={false}
            hoverMode="opacity"
          >
            {expanded ? (
              <Icon16DropdownOutline
                className={styles.icon}
                width={20}
                height={20}
              />
            ) : (
              <Icon20ChevronRightOutline className={styles.icon} />
            )}
          </IconButton>
        )}
      <SimpleCell
        className={styles.checkbox_wrapper}
        onClick={handleChange}
        data-value={item.id}
        before={
          <Checkbox
            key={item.id}
            checked={checkStatusToValueMap[status]}
            onChange={() => {}}
          />
        }
      >
        <div
          className={styles.checkbox_label}
        >{`${item.title} ${item.id}`}</div>
      </SimpleCell>
    </div>
  );
};
