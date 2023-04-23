import { Fragment } from "react";

import classes from "./list.module.css";

export default function ListItem(props) {
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
}
