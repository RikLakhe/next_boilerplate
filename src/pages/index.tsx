import React, { useState } from "react";
import FilterItem from "@/components/ui/filter-items.module";
import Filter from "@/components/ui/filter.module";
import ListItem from "@/components/ui/list-item.module";
import List from "@/components/ui/list.module";
import { ENTRIES_API } from "@/config/appConfig";
import { useRouter } from "next/router";
import Lock from "@/assets/icons/lock.svg";
import Image from "next/image";
interface Entry {
  API: string;
  Description: string;
  Link: string;
  Category: string;
  Auth: string;
}
interface HomeProps {
  entries: [Entry];
  categories: [string];
}

export default function Home(props: HomeProps) {
  const route = useRouter();
  const [filterSelected, setFilterSelected] = useState<string[]>([]);

  const handleEntryClick = (entryItem: Entry) => {
    const newWindow = window.open(
      entryItem.Link,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleFilterClick = (filterItem: string) => {
    let newArray: string[] = filterSelected;
    if (newArray.indexOf(filterItem) === -1) {
      newArray.push(filterItem);
    } else {
      newArray = newArray.filter((item) => item !== filterItem);
    }

    setFilterSelected([...newArray]);
  };

  return (
    <main>
      <h1>Home routes</h1>
      <hr />
      <Filter>
        {props.categories.map((categoryItem, categoryIndex: number) => {
          return (
            <FilterItem
              key={categoryIndex}
              handleClick={() => handleFilterClick(categoryItem)}
              active={
                filterSelected.indexOf(categoryItem) === -1 ? false : true
              }
            >
              <div>{categoryItem}</div>
            </FilterItem>
          );
        })}
      </Filter>

      <hr />

      <List>
        {props.entries
          .filter((item) => {
            if (filterSelected.length > 0) {
              if (filterSelected.indexOf(item.Category) >= 0) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          })
          .map((entryItem, entryIndex: number) => {
            return (
              <ListItem
                key={entryIndex}
                onClick={() => handleEntryClick(entryItem)}
              >
                <h2>{entryItem.API}</h2>
                <div>{entryItem.Description}</div>
                <div>{entryItem.Category}</div>
                {entryItem.Auth !== "" && (
                  <Image src={Lock} height={20} alt={"Locked"} />
                )}
              </ListItem>
            );
          })}
      </List>
    </main>
  );
}

export async function getStaticProps() {
  const data = await fetch(ENTRIES_API);
  const jsonData = await data.json();

  return {
    props: {
      entries: jsonData.entries,
      categories: jsonData.entries
        .map((a: Entry) => a.Category)
        .filter(
          (value: string, index: number, array: [string]) =>
            array.indexOf(value) === index
        ),
    },
  };
}
