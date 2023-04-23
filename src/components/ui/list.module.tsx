import React, { Fragment } from "react";

import classes from "./list.module.css";

interface ListProps {
  children: React.ReactNode;
}

const List: React.FC<ListProps> = (props) => {
  return (
    <Fragment>
      <div className={classes.wrapper}>{props.children}</div>
    </Fragment>
  );
};

export default List;
