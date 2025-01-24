import { useRef, useState } from "react";
import FilterNotes from "@/components/Notes/FilterNotes";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import CardContainer from "@/components/CardContainer";
import Navbar from "@/components/Navbar";
const Notes = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const searchParams = useRef({
    branch: [],
    searchQuery: "",
  });
  return (
    <>
    <Navbar/>
    <div className="w-screen h-screen">
      <div className="w-[90%] lg:w-[80%]  mx-auto flex gap-y-3 flex-col sm:flex-row pt-4 items-center justify-center sm:justify-evenly">
        <div>
          <Button
            onClick={() => {
              setFilterOpen(true);
            }}
          >
            Filter Search
          </Button>
        </div>
        <Input
          placeholder="Enter subject name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[80%] sm:w-[60%] h-[40px]"
        />
      </div>
      <div className="mt-10 h-[88vh]">
         <CardContainer />
      </div>
      <FilterNotes
        filterOpen={filterOpen}
        searchQuery={searchQuery}
        searchParams={searchParams}
        setFilterOpen={setFilterOpen}
      />
    </div>
    </>
  );
};

export default Notes;
