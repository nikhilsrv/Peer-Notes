import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Card from "../Card";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import Loader from "../Loader";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import {
  changeStatus,
  getAllNotes,
  deleteNotes,
} from "@/store/slices/adminSlice";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";

const Container = ({
  searchParams,
  section,
  searchQuery,
  setSearchQuery,
  setFilterOpen,
}) => {
  const { notesList} = useSelector((state) => state.admin);
  const { notesDetail, getNotesDetailLoading } = useSelector(
    (state) => state.notes
  );
  const [notesDetailOpen, setNotesDetailOpen] = useState(false);
  const [loading_downloading, setloading_downloading] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setNotesDetailOpen(false);
  };

  const downloadAll = () => {
    const zip = new JSZip();
    const files = [...notesDetail?.files];
    setloading_downloading(true);
    Promise.all(
      files.map((item, index) => {
        return fetch(item?.url)
          .then((response) => response.blob())
          .then((blob) => {
            const filename = item?.originalname;
            zip.file(filename, blob);
          });
      })
    )
      .then(() => {
        zip.generateAsync({ type: "blob" }).then(function (content) {
          var link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = "files.zip";
          link.click();
          link.remove();
          setloading_downloading(false);
        });
      })
      .catch((error) => {
        console.error("Error creating ZIP:", error);
        setloading_downloading(false);
      });
  };

  const downloadFile = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "your_image.jpg";
        link.click();
        link.remove();
      })
      .catch((error) => console.error("Download failed:", error));
  };
  const handleStatus = (status) => {
    const formData = {
      notesId: notesDetail?.id,
      newStatus: status,
    };
    dispatch(changeStatus(formData)).then((data) => {
      if (data?.payload?.success)
        toast({ title: "Success", description: "Status changed successfully" });
      else toast({ title: "Error", description: "Error changing status" });
      dispatch(
        getAllNotes(
          new URLSearchParams({
            filter: JSON.stringify(searchParams.current),
          }).toString()
        )
      );
    });
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteNotes(notesDetail?.id)).then(() => {
      dispatch(
        getAllNotes(
          new URLSearchParams({
            filter: JSON.stringify(searchParams.current),
          }).toString()
        )
      );
    });

    handleClose();
  };
  return (
    <div className="w-[80vw] md:w-[95vw] h-[88vh] overflow-y-scroll remove-scrollbar mx-auto">
      <div className="w-[90%] lg:w-[80%] mx-auto flex gap-y-3 flex-col sm:flex-row pt-4 items-center justify-center sm:justify-evenly">
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

      <div className="mt-10 w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {notesList?.map((item, idx) => {
          return (
            <Card
              key={idx}
              item={item}
              setNotesDetailOpen={setNotesDetailOpen}
            />
          );
        })}
      </div>
      <Dialog
        open={notesDetailOpen}
        onOpenChange={handleClose}
        className="relative"
      >
        <DialogContent className="max-h-[70vh] remove-scrollbar overflow-y-scroll max-w-[70vw] lg:max-w-[60vw] xl:max-w-[45vw]">
          {getNotesDetailLoading ? (
            <Loader />
          ) : (
            <>
              <div className="w-[70%] mx-auto font-bold flex-col sm:flex-row flex gap-x-4 items-center justify-center sm:justify-between mt-3">
                <div className="text-center">{notesDetail?.subject || ""}</div>
                <div className="text-center">{notesDetail?.branch || ""}</div>
              </div>
              <div className="w-[70%] mx-auto font-bold flex gap-x-4 justify-center mt-3">
                <div>Uploaded by {notesDetail?.user?.userName || ""}</div>
              </div>
              <div className="w-[80%] mx-auto flex flex-col gap-3">
                <div className="text-center font-bold">Files</div>
                <div className="w-full flex justify-center items-center gap-3 flex-wrap">
                  {notesDetail?.files.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="px-4 py-2 cursor-pointer border-[2px] border-[black] rounded-lg"
                      >
                        <div
                          className="text-[10px] sm:text-[16px]"
                          onClick={() => downloadFile(item?.url)}
                        >
                          {item?.originalname}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w-[90%] mt-4 mx-auto flex justify-evenly">
                <div className="flex flex-col justify-center items-center gap-y-1 w-[50px]">
                  <div className="cursor">
                    <ThumbsUp />
                  </div>
                  <div>{notesDetail?.likes?.length || 0}</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-1 w-[50px]">
                  <div className="cursor-pointer">
                    <ThumbsDown />
                  </div>
                  <div>{notesDetail?.dislikes?.length || 0}</div>
                </div>
              </div>
              <div className="flex justify-center gap-4 items-center">
                {loading_downloading ? (
                  <Button className="w-[100px] h-[50px]">
                    <span className="spinner"></span>
                  </Button>
                ) : (
                  <Button
                    className="w-[100px] h-[50px]"
                    onClick={() => downloadAll()}
                  >
                    Download
                  </Button>
                )}
                <Button
                  className="w-[100px] h-[50px]"
                  onClick={() => handleDelete()}
                >
                  Delete
                </Button>
              </div>
              <div className="flex justify-evenly flex-wrap gap-3 items-center">
                <Button
                  className="w-[100px] hover:bg-[green] bg-[green] h-[50px]"
                  onClick={() => handleStatus("approved")}
                >
                  Approve
                </Button>
                <Button
                  className="w-[100px] hover:bg-[red] bg-[red] h-[50px]"
                  onClick={() => handleStatus("rejected")}
                >
                  Reject
                </Button>
              </div>
              <div className="w-[90%] mx-auto">
                <h1 className="font-bold text-2xl text-center">Comments</h1>
                <Separator className="mt-2" />
                <div className="w-full mt-4">
                  {notesDetail?.Comment?.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="px-5 mt-2 py-4 rounded-lg bg-[#F5F4F2]"
                      >
                        <div className="flex gap-x-4  items-center">
                          <div className="text-[15px] font-bold">
                            {item?.user?.userName || "NA"}
                          </div>
                          <div className="text-[12px]">
                            {item?.createdAt?.substring(0, 10) || "NA"}
                          </div>
                        </div>
                        <div className="">{item?.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Container;
