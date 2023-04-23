import { Fragment } from "react";
import classes from "./filter.module.css";

interface FilterItemProps {
  active: boolean;
  children: React.ReactNode;
  handleClick: ({}) => void;
}

const FilterItem: React.FC<FilterItemProps> = (props) => {
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
};

export default FilterItem;
