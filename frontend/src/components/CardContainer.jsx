import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import "@/App.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import {
  getAllNotes,
  getNotesDetail,
  likeDislike,
} from "@/store/slices/notesSlice";
import { Separator } from "@/components/ui/separator";
import { addComments } from "@/store/slices/notesSlice";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";
const CardContainer = () => {
  const [notesDetailOpen, setNotesDetailOpen] = useState(false);
  const [loading_downloading,setloading_downloading]=useState(false)
  const [comment, setComment] = useState("");
  const { notesDetail, notesList,getNotesLoading, hasLiked, hasDisliked,isLoading,loading_comment } =
    useSelector((state) => state.notes);
  const dispatch = useDispatch();

  const handleClose = () => {
    setNotesDetailOpen(false);
  };

  const handleViews = (view) => {
    const formdata = { id: notesDetail?.id, view };
    dispatch(likeDislike(formdata)).then((data) => {
      if(data?.payload?.success)
      dispatch(getNotesDetail(notesDetail?.id));
      else
      toast({title:"Error while voting",description:data?.payload?.message,variant:"destructive"})
    });
  };

  const saveComments = (notesId) => {
    const formData = { notesId, value: comment };

    dispatch(addComments(formData)).then((data)=>{
      if(!data?.payload?.success)
      toast({title:"Error saving comment",description:data.payload.message,variant:"destructive"})
      else{
        toast({title:"Done",description:data.payload.message})
      }
    }).catch((data)=>{
      toast({title:"Error saving comment",description:data.payload.message,variant:"destructive"})
    });

    handleClose()
    setComment("")
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

  useEffect(() => {
    dispatch(getAllNotes()).then(() => {
      getNotesDetail(notesDetail?.id);
    });
  }, [dispatch]);

  return (
    <div className="w-screen h-[68vh] overflow-y-scroll">
      <div className="w-[80%] overflow-y-scroll remove-scrollbar  mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
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
          {isLoading?
          <Loader/>:
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
                      onClick={() =>
                        downloadFile(item?.url)
                      }
                    >
                      {item?.originalname || ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-[90%] mt-4 mx-auto flex justify-evenly">
            <div className="flex flex-col justify-center items-center gap-y-1 w-[50px]">
              <div
                className="cursor-pointer"
                onClick={() => handleViews("like")}
              >
                <ThumbsUp color={hasLiked ? "blue" : "black"} />
              </div>
              <div>{notesDetail?.likes?.length || 0}</div>
            </div>
            <div className="flex flex-col justify-center items-center gap-y-1 w-[50px]">
              <div
                className="cursor-pointer"
                onClick={() => handleViews("dislike")}
              >
                <ThumbsDown color={hasDisliked ? "blue" : "black"} />
              </div>
              <div>{notesDetail?.dislikes?.length || 0}</div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            {loading_downloading ? (
              <Button className="w-[100px] h-[50px]">
                <span className="spinner"></span>
              </Button>
            ) : (
              <Button className="w-[100px] h-[50px]" onClick={() => downloadAll()}>
                Download
              </Button>
            )}
          </div>
          <div className="w-[90%] mx-auto">
            <h1 className="font-bold text-2xl text-center">Comments</h1>
            <Separator className="mt-2" />
            <div className="w-[98%] mx-auto mt-5 gap-y-2 flex flex-col sm:flex-row justify-between">
              <Input
                placeholder="Enter comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full sm:w-[70%]"
              />
              {loading_comment ? (
                <Button className="text-[10px] sm:text-[16px] w-[100px] h-[50px]">Loading</Button>
              ) : (
                <Button
                  className="text-[10px] mx-auto sm:text-[16px] w-[100px] h-[40px]"
                  onClick={() => saveComments(notesDetail?.id)}
                >
                  Comment
                </Button>
              )}
            </div>
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
          </div></>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardContainer;
