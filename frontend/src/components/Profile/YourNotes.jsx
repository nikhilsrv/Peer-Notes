import React, { useState, useRef } from "react";
import NotesContainer from "./NotesContainer";
import ProfileFilter from "./ProfileFilter";
const YourNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const searchParams = useRef({
    branch: [],
    searchQuery: "",
    status: "",
  });

  return (
    <div>
      <NotesContainer
        filterOpen={filterOpen}
        searchParams={searchParams}
        searchQuery={searchQuery}
        setFilterOpen={setFilterOpen}
        setSearchQuery={setSearchQuery}
      />
      <ProfileFilter
        filterOpen={filterOpen}
        searchParams={searchParams}
        searchQuery={searchQuery}
        setFilterOpen={setFilterOpen}
      />
    </div>
  );
};

export default YourNotes;
