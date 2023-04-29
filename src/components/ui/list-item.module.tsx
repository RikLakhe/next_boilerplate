import React, { Fragment } from "react";

import classes from "./list.module.css";

interface ListItemProps {
  key: number;
  children: React.ReactNode;
  onClick: () => void;
}

const ListItem: React.FC<ListItemProps> = (props) => {
  const handleListItemClick = () => {
    props.onClick();
  };

  return (
    <Fragment>
      <div
        key={props.key}
        className={classes.item}
        onClick={handleListItemClick}
      >
        {props.children}
      </div>
    </Fragment>
  );
};

export default ListItem;
