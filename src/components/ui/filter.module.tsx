import { Fragment } from "react";

import classes from "./filter.module.css";

export default function Filter(props) {
  return (
    <Fragment>
      <div className={classes.wrapper}>{props.children}</div>
    </Fragment>
  );
}
