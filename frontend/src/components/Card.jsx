import React from "react";
import cs from "../assets/cs.png";
import { getNotesDetail } from "@/store/slices/notesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { images } from "../config/images";
import { Skeleton } from "./ui/skeleton";

const Card = ({ setNotesDetailOpen, item }) => {
  const dispatch = useDispatch();
  const handleOpen = (id) => {
    setNotesDetailOpen(true);
    dispatch(getNotesDetail(id));
  };

  const { getNotesLoading } = useSelector((state) => state.notes);

  return (
    <div className="w-full py-4 bg-[white] shadow-lg border-[2px] flex items-center justify-between  rounded-lg mt-2 px-2">
      {getNotesLoading ? (
        <div className="flex items-center h space-x-4">
          <Skeleton className="h-12 w-12 rounded-full hidden min-[500px]:block" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <>
          <div className="hidden min-[500px]:block w-[28%] h-32 xl:w-[30%] xl:h-36">
            <img src={images[item?.branch]} className="w-full h-full" alt="" />{" "}
          </div>
          <div className="w-[60%] mx-auto">
            <div className="w-full flex flex-col justify-center items-center  gap-2 xl:flex-row xl:justify-between">
              <div className="bg-[#E7E7E7] text-center px-4 py-1 rounded-lg text-[12px] xl:text-[14px] font-semibold">
                {item?.subject || ""}
              </div>
              <div className="bg-[#E7E7E7] text-center px-4 py-1 rounded-lg text-[12px] xl:text-[14px] font-semibold">
                {item?.branch || ""}
              </div>
            </div>
            <div className="flex justify-center items-center mt-4">
              <div className="font-semibold text-[15px]">
                Uploaded By - {item?.user?.userName || ""}
              </div>
            </div>
            <div className="flex justify-center mt-2 items-center">
              <Button
                onClick={() => handleOpen(item?.id)}
                className="px-5 py-2 text-[12px] xl:text-[16px] rounded-3xl bg-[black] text-[white]"
              >
                Details
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
