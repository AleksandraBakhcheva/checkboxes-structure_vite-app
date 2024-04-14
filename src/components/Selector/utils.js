import { ItemCheckStatus } from "../../utils/constants.js";

export const findTreeItem = (items, predicate) => {
  let foundItem = null;

  items.some((item) => {
    foundItem = predicate(item)
      ? item
      : findTreeItem(item.categories || [], predicate);
    return Boolean(foundItem);
  });

  return foundItem;
};

export const findItemById = (items, id) => {
  return findTreeItem(items, (item) => item.id === id);
};

export const isCurrentItemSelected = (selectedItems, id) => {
  return Boolean(selectedItems.find((item) => item.id === id));
};

const getAllSelectedChildren = (item, selectedItems) => {
  return (item.categories || []).reduce((res, child) => {
    if (isCurrentItemSelected(selectedItems, child.id)) {
      res.push(child);
      return res;
    }

    res.push(...getAllSelectedChildren(child, selectedItems));
    return res;
  }, []);
};

const getAllParents = (items, item) => {
  let parentId = item.parentId;
  const parents = [];

  while (parentId) {
    const item = findItemById(items, parentId);
    if (item) {
      parents.push(item);
    }
    parentId = item?.parentId;
  }

  return parents;
};

export const getSelectedItems = (items, selectedItems, id) => {
  const filteredSelectedItems = selectedItems.filter((item) => item.id !== id);

  if (filteredSelectedItems.length !== selectedItems.length) {
    return filteredSelectedItems;
  }

  const item = findItemById(items, id);

  if (!item) {
    return selectedItems;
  }

  const includeItems = [];
  const excludeItems = [];

  const selectedChildren = getAllSelectedChildren(item, selectedItems);

  excludeItems.push(...selectedChildren);

  const parents = getAllParents(items, item);
  const selectedParents = parents.filter((item) =>
    isCurrentItemSelected(selectedItems, item.id)
  );

  if (!parents.length) {
    includeItems.push(item);
  } else if (selectedParents.length) {
    let headParent = selectedParents[selectedParents.length - 1];
    excludeItems.push(headParent);

    while (headParent) {
      if (
        headParent.categories?.some((childItem) => childItem.id === item.id)
      ) {
        includeItems.push(
          ...headParent.categories.filter(
            (childItem) => childItem.id !== item.id
          )
        );
        headParent = null;
      } else if (headParent.categories) {
        const newHeadParent =
          parents.find((parentItem) => {
            return Boolean(
              headParent?.categories?.find(
                (childItem) => parentItem.id === childItem.id
              )
            );
          }) || null;

        includeItems.push(
          ...headParent.categories.filter(
            (childItem) => childItem.id !== newHeadParent?.id
          )
        );

        headParent = newHeadParent;
      } else {
        headParent = null;
      }
    }
  } else {
    let currentWatchedItem = item;

    for (const parent of parents) {
      const childrenCount = parent.categories?.length;
      const selectedChildren =
        parent.categories?.filter((childItem) =>
          isCurrentItemSelected(selectedItems, childItem.id)
        ) || [];
      if (childrenCount !== selectedChildren.length - 1) {
        includeItems.push(currentWatchedItem);
        break;
      }

      excludeItems.push(...selectedChildren);
      currentWatchedItem = parent;
    }
  }

  return selectedItems
    .filter((selectedItem) => {
      return !excludeItems.find(
        (excludeItem) => selectedItem.id === excludeItem.id
      );
    })
    .concat(includeItems);
};

export const isParentSelected = (treeItems, selectedItems, item) => {
  let parent = item?.parentId && findItemById(treeItems, item.parentId);

  while (parent) {
    if (isCurrentItemSelected(selectedItems, parent.id)) {
      return true;
    }

    parent = parent.parentId ? findItemById(treeItems, parent.parentId) : null;
  }

  return false;
};

export const getStatusByChildren = (items, selectedItems, item) => {
  if (!item.categories?.length) {
    return ItemCheckStatus.UNCHECKED;
  }

  let checkedChildrenCount = 0;

  for (const childItem of item.categories) {
    const currentItemStatus = getItemCheckStatus(
      items,
      selectedItems,
      childItem.id
    );

    if (currentItemStatus === ItemCheckStatus.INDETERMINATE) {
      return ItemCheckStatus.INDETERMINATE;
    }

    if (currentItemStatus === ItemCheckStatus.CHECKED) {
      ++checkedChildrenCount;
    }
  }

  if (checkedChildrenCount === item.categories.length) {
    return ItemCheckStatus.CHECKED;
  }

  return checkedChildrenCount > 0
    ? ItemCheckStatus.INDETERMINATE
    : ItemCheckStatus.UNCHECKED;
};

export const getItemCheckStatus = (items, selectedItems, id) => {
  if (isCurrentItemSelected(selectedItems, id)) {
    return ItemCheckStatus.CHECKED;
  }

  const item = findItemById(items, id);

  if (!item) {
    return ItemCheckStatus.UNCHECKED;
  }

  if (isParentSelected(items, selectedItems, item)) {
    return ItemCheckStatus.CHECKED;
  }

  return getStatusByChildren(items, selectedItems, item);
};

export const changeStatus = (item, status, itemsStatuses, itemsRerender) => {
  itemsStatuses[item.id] = status;
  itemsRerender.push(item.id);

  if (!item.categories) {
    return;
  }

  for (let i = 0; i < item.categories.length; i++) {
    changeStatus(item.categories[i], status, itemsStatuses, itemsRerender);
  }
};

export const updateItemStatus = (id, treeItems, selectedItems, statuses) => {
  const item = findItemById(treeItems, id);

  if (!item) {
    return [];
  }

  const itemStatus = statuses[id] || ItemCheckStatus.UNCHECKED;
  const newStatus =
    itemStatus === ItemCheckStatus.CHECKED
      ? ItemCheckStatus.UNCHECKED
      : ItemCheckStatus.CHECKED;
  const rerenderItems = [];

  changeStatus(item, newStatus, statuses, rerenderItems);

  const parents = getAllParents(treeItems, item);

  for (let i = 0; i < parents.length; i++) {
    statuses[parents[i].id] = getItemCheckStatus(
      treeItems,
      selectedItems,
      parents[i].id
    );
  }

  const parentItems = parents.map((parent) => parent.id);

  return [...rerenderItems, ...parentItems];
};
