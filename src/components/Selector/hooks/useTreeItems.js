import data from "../../../mock/data.json";

export const useTreeItems = () => {
  const getTreeItemsById = (id) => {
    const item = data.find((item) => item.id === id);
    return [item];
  };

  return { treeItems: data, getTreeItemsById };
};
