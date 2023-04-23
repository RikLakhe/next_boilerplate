import React, { Fragment } from "react";

import classes from "./filter.module.css";

interface FilterProps {
  children: React.ReactNode;
}

const Filter: React.FC<FilterProps> = (props) => {
  return (
    <Fragment>
      <div className={classes.wrapper}>{props.children}</div>
    </Fragment>
  );
};

export default Filter;
