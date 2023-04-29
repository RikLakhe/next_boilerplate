import { useRouter } from "next/router";
import { Fragment } from "react";

export default function Projects() {
  const route = useRouter();

  console.log("route", route.query);
  return <Fragment>Test Projects</Fragment>;
}
