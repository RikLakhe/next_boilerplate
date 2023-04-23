import { Fragment } from "react";
import classes from "./filter.module.css";

export default function FilterItem(props) {
  return (
    <Fragment>
      <div
        className={`${classes.filterItem} ${
          props.active ? classes.filterItemActive : ""
        } `}
        onClick={props.handleClick}
      >
        {props.children}
      </div>
    </Fragment>
  );
}
