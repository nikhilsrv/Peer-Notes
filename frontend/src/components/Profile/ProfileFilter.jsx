import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { subjects } from "@/config/filter";
import { Button } from "../ui/button";
import "@/App.css";
import { Checkbox } from "@/components/ui/checkbox";
import { getUserNotes } from "@/store/slices/notesSlice";
import { useDispatch } from "react-redux";

const ProfileFilter = ({
  filterOpen,
  searchParams,
  searchQuery,
  setFilterOpen,
}) => {
  const [filters, setFilters] = useState([...subjects]);
  const dispatch = useDispatch();

 
  const applyFilters = () => {
    const tempParams = filters.filter((item) => item?.selected);
    searchParams.current.branch = tempParams.map((item) => item.name);
    setFilterOpen(false);
    dispatch(
      getUserNotes(
        new URLSearchParams({
          filter: JSON.stringify(searchParams.current),
        }).toString()
      )
    );
  };

  useEffect(() => {
    searchParams.current.searchQuery = searchQuery;

    const timeout = setTimeout(() => {
      dispatch(
        getUserNotes(
          new URLSearchParams({
            filter: JSON.stringify(searchParams.current),
          }).toString()
        )
      );
    },1000);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div>
      <Sheet open={filterOpen} onOpenChange={() => setFilterOpen(!filterOpen)}>
        <SheetContent
          side="left"
          className="remove-scrollbar w-[50vw] sm:w-[30vw] lg::w-[20vw] overflow-y-scroll"
        >
          <SheetHeader>
            <SheetTitle>
              <div className="text-center text-3xl">Filters</div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 w-full flex flex-col gap-y-3">
            {filters?.map((item, idx) => (
              <div
                className="flex w-full justify-between"
                key={idx}
                onClick={() =>
                  setFilters((filters) =>
                    filters.map((filter, index) =>
                      index == idx
                        ? { ...filter, selected: !filter.selected }
                        : filter
                    )
                  )
                }
              >
                <div className="text-[12px] sm:text-[18px]">
                  {item?.name || ""}
                </div>
                <div>
                  <Checkbox checked={item?.selected} />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full mt-5 flex justify-center">
            <Button
              className="text-[12px] sm:text-[16px]"
              onClick={() => applyFilters()}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProfileFilter;
