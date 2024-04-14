import styles from "./Selector.module.css";
import { useCallback, useMemo, useRef } from "react";
import { BranchItem } from "../Tree/Tree";
import { Item } from "../Item/Item";
import { ItemCheckStatus } from "../../utils/constants.js";
import { useTreeItems } from "./hooks/useTreeItems.js";
import { findItemById, getSelectedItems, updateItemStatus } from "./utils";

export const Selector = (props) => {
  const { selected, onChange } = props;
  const { treeItems, getTreeItemsById } = useTreeItems();
  const rerenderItems = useRef([]);
  const statuses = useRef({});

  const selectedItems = useMemo(() => {
    return selected.reduce((res, id) => {
      const item = findItemById(treeItems, id);
      if (item) {
        res.push(item);
      }
      return res;
    }, []);
  }, [selected, treeItems]);

  const onTreeChange = useCallback(
    (e) => {
      const cell = e?.target?.closest(".vkuiSimpleCell");
      const id = Number(cell?.dataset.value) || "";

      const newSelectedItems = getSelectedItems(treeItems, selectedItems, id);
      rerenderItems.current = updateItemStatus(
        id,
        treeItems,
        newSelectedItems,
        statuses.current
      );
      onChange(newSelectedItems.map((item) => item.id));
    },
    [onChange, treeItems, selectedItems]
  );

  const renderPadsBranch = useCallback(
    ({ item, ...restProps }) => {
      return (
        <BranchItem
          item={item}
          status={statuses.current[item.id] || ItemCheckStatus.UNCHECKED}
          {...restProps}
        />
      );
    },
    [selectedItems, treeItems]
  );

  return (
    <div className={styles.select_container}>
      {treeItems.map((item) => (
        <Item
          key={item.id}
          title={`${item.title} ${item.id}`}
          items={getTreeItemsById(item.id)}
          branchComponent={renderPadsBranch}
          leafComponent={renderPadsBranch}
          onTreeChange={onTreeChange}
        />
      ))}
    </div>
  );
};
