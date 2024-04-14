import styles from "./Tree.module.css";
import { Branch } from "./components/Branch";
import { Leaf } from "./components/Leaf";

export const Tree = (props) => {
  const { items, leafComponent, branchComponent } = props;

  return (
    <div className={styles.tree}>
      {items?.map((item, index) => {
        return (
          <div key={index}>
            {item.categories?.length ? (
              <Branch
                item={item}
                leafComponent={leafComponent}
                branchComponent={branchComponent}
              />
            ) : (
              <Leaf leafComponent={leafComponent} item={item} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export { BranchItem } from "../BranchItem/BranchItem";
