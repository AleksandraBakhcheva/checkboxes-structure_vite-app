import { useState } from "react";
import { Tree } from "../Tree.jsx";

export const Branch = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <props.branchComponent
        item={props.item}
        expanded={expanded}
        toggleExpand={() => setExpanded(!expanded)}
      />
      {expanded && <Tree {...props} items={props.item.categories} />}
    </>
  );
};
