import { Fragment } from "react";

import classes from "./list.module.css";

export default function List(props) {
  return (
    <Fragment>
      <div className={classes.wrapper}>{props.children}</div>
    </Fragment>
  );
}
