import styles from "./Item.module.css";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Tree } from "../Tree/Tree.jsx";

export const Item = (props) => {
  const { title, items, branchComponent, leafComponent, onTreeChange } = props;
  const [isShowCheckboxes, setIsShowCheckboxes] = useState(false);

  const handleClick = () => {
    setIsShowCheckboxes((prevState) => !prevState);
  };

  return (
    <div className={styles.item_container}>
      <h1>{title}</h1>
      <Button onClick={handleClick}>
        {isShowCheckboxes ? "Hide Checkboxes" : "Show Checkboxes"}
      </Button>
      <div
        className={
          isShowCheckboxes ? styles.show_checkboxes : styles.hide_checkboxes
        }
        onClick={onTreeChange}
      >
        <Tree
          items={items}
          branchComponent={branchComponent}
          leafComponent={leafComponent}
        />
      </div>
    </div>
  );
};
