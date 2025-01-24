import React from "react";
import cs from "@/assets/cs.png";
import { getNotesDetail } from "@/store/slices/notesSlice";
import { useDispatch, useSelector } from "react-redux";
import { images } from "@/config/images.js";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
const ProfileNotesCard = ({ item, handleOpen }) => {
  const dispatch = useDispatch();
  const { getNotesLoading } = useSelector((state) => state.notes);
  const handleDialog = (id) => {
    handleOpen("details");
    dispatch(getNotesDetail(id));
  };

  return (
    <div className="w-full py-4 bg-[white]  remove-scrollbar shadow-lg border-[2px] flex items-center justify-between  rounded-lg mt-2 px-2">
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
              <div className="bg-[#E7E7E7] px-4 py-1 rounded-lg text-[12px] xl:text-[14px] font-semibold">
                {item?.subject || ""}
              </div>
              <div className="bg-[#E7E7E7] px-4 py-1 text-center rounded-lg text-[12px] xl:text-[14px] font-semibold">
                {item?.branch || ""}
              </div>
            </div>
            <div className="flex justify-center items-center mt-4">
              <div className="font-semibold text-center text-[15px]">
                Uploaded By - {item?.user?.userName || ""}
              </div>
            </div>
            <div className="flex justify-center mt-2 items-center">
              <Button
                onClick={() => handleDialog(item?.id || "")}
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

export default ProfileNotesCard;
