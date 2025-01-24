import React, { useEffect, useState } from "react";
import ProfileNotesCard from "./ProfileNotesCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { editNotes, deleteNotes } from "@/store/slices/notesSlice";
import { Button } from "@/components/ui/button";
import { getUserNotes } from "@/store/slices/notesSlice";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "../ui/input";
import JSZip from "jszip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "@/App.css";
import { useDispatch, useSelector } from "react-redux";
import { useUploadFiles } from "@/hooks/useUploadFiles";
import { useToast } from "@/hooks/use-toast";
import Loader from "../Loader";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CardContainer = ({searchQuery,setFilterOpen,setSearchQuery}) => {
  const [notesDetailOpen, setNotesDetailOpen] = useState(false);
  const [notesEditOpen, setNotesEditOpen] = useState(false);
  const [files, setFiles] = useState(null);
  const dispatch = useDispatch();
  const { loading, uploadFiles } = useUploadFiles();
  const [uploadedFilesList, setUploadedFilesList] = useState([]);
  const { toast } = useToast();
  const {
    userNotesList,
    notesDetail,
    isloading,
    getNotesDetailLoading,
  } = useSelector((state) => state.notes);

  const [loading_downloading, setloading_downloading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notes, setNotes] = useState({
    subject: "",
    branch: "",
    files: [],
  });

  useEffect(() => {
    setNotes(notesDetail);
    setUploadedFilesList(notesDetail?.files);
  }, [notesDetail]);

  const handleClose = (section) => {
    if (section === "details") setNotesDetailOpen(false);

    if (section === "edit") setNotesEditOpen(false);
  };

  const handleOpen = async (section) => {
    if (section === "details") {
      setNotesDetailOpen(true);
      setNotesEditOpen(false);
    } else {
      setNotesDetailOpen(false);
      setNotesEditOpen(true);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);

    const data = await uploadFiles(formData);
    
    if (data?.files) {
      setUploadedFilesList([...uploadedFilesList, ...data.files]);
      setNotes({ ...notes, files: [...notes.files, ...data.files] });
    } else {
      toast({
        title: "Internal Server Error",
        description: "Error uploading files",
        variant: "destructive",
      });
    }
  };

  const removeUploadedFile = (index) => {
    const files = [...uploadedFilesList];
    const newFiles = files.filter((item, idx) => idx != index);
    setUploadedFilesList(newFiles);
  };

  const handleSubmit = () => {
    dispatch(editNotes(notes)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Congratulations",
          description: "Files Edited Successfully",
        });
        handleClose("edit");
      } else {
        
        toast({
          title: "Sorry !",
          description: "Error occurred while adding notes.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = (action) => {
    if (action === "continue") {
      dispatch(deleteNotes(notesDetail?.id || ""))
        .then((data) => {
          if (data?.payload?.success) {
            toast({ title: "Done", description: "Notes deleted successfully" });
            setNotesDetailOpen(false);
            dispatch(getUserNotes());
          } else
            toast({
              title: "Error",
              description: "Something went wrong while deleting notes",
            });
        })
        .catch((data) => {
          toast({
            title: "Error",
            description: "Something went wrong while deleting notes",
          });
        });
    }
    setDeleteDialogOpen(false);
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
    dispatch(getUserNotes())
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  return (
    <div className="w-[80vw] md:w-[95vw] h-[85vh] overflow-y-scroll remove-scrollbar">
      <div className="w-[90%] lg:w-[80%] mx-auto flex gap-y-3 flex-col sm:flex-row pt-3 items-center justify-center sm:justify-evenly">
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
        <div className="w-[80%] mx-auto mt-1 overflow-y-scroll remove-scrollbar sm:mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {userNotesList?.map((item, idx) => {
            return (
              <ProfileNotesCard item={item} key={idx} handleOpen={handleOpen} />
            );
          })}
        </div>
      
      <Dialog
        open={notesDetailOpen}
        onOpenChange={() => handleClose("details")}
        className="relative"
      >
        <DialogContent className="max-h-[70vh] overflow-y-scroll remove-scrollbar max-w-[70vw] lg:max-w-[60vw] xl:max-w-[45vw]">
          {getNotesDetailLoading ? (
            <Loader />
          ) : (
            <>
              <div className="w-full font-bold flex  flex-col justify-center gap-2 items-center sm:flex-row sm:justify-evenly mt-3">
                <div className="text-center">{notesDetail?.subject || ""}</div>
                <div className="text-center">{notesDetail?.branch || ""}</div>
              </div>
              <div className="w-full font-bold flex gap-x-4 justify-center mt-3">
                Uploaded By : {notesDetail?.user?.userName || ""}
              </div>
              <div className="w-full font-bold flex gap-x-4 justify-center mt-3">
                Status : {notesDetail?.status || ""}
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-center font-bold">Files</div>
                <div className="flex justify-center items-center gap-3 flex-wrap">
                  {notesDetail?.files?.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="px-4 py-2 text-[10px] sm:text-[16px] border-[2px] border-[black] rounded-lg cursor-pointer"
                        onClick={() => downloadFile(item?.url)}
                      >
                        <div>{item?.originalname}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-evenly flex-wrap gap-3 items-center">
                {loading_downloading ? (
                  <Button className="w-30 h-10">
                    <span className="spinner"></span>
                  </Button>
                ) : (
                  <Button className="w-30 h-10" onClick={() => downloadAll()}>
                    Download
                  </Button>
                )}

                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-30 h-10"
                >
                  Delete
                </Button>

                <Button
                  className="w-30 h-10"
                  onClick={() => handleOpen("edit")}
                >
                  Edit
                </Button>
              </div>
              <div className="w-[90%] mt-4 mx-auto flex justify-evenly">
                <div className="flex flex-col justify-center items-center gap-y-1 w-[50px]">
                  <div>
                    <ThumbsUp />
                  </div>
                  <div>{notesDetail?.likes?.length || 0}</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-1 w-[50px]">
                  <div>
                    <ThumbsDown />
                  </div>
                  <div>{notesDetail?.dislikes?.length || 0}</div>
                </div>
              </div>
              <div className="w-[90%] mx-auto">
                <h1 className="font-bold text-xl sm:text-2xl text-center">
                  Comments
                </h1>
                <Separator className="mt-2" />
                <div className="w-full mt-4">
                  {notesDetail?.Comment?.length > 0 ? (
                    notesDetail?.Comment?.map((item, idx) => {
                      return (
                        <div
                          key={idx}
                          className="px-5 mt-2 py-4 rounded-lg bg-[#F5F4F2]"
                        >
                          <div className="flex gap-x-4  items-center">
                            <div className="text-[10px] sm:text-[15px] font-bold">
                              {item?.user?.userName || "NA"}
                            </div>
                            <div className="text-[8px] sm:text-[12px]">
                              {item?.createdAt?.substring(0, 10) || "NA"}
                            </div>
                          </div>
                          <div className="">{item?.value}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div>No Comments till now..</div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={notesEditOpen}
        onOpenChange={() => handleClose("edit")}
        className="relative"
      >
        <DialogContent className="remove-scrollbar max-h-[85vh] md:max-h-[70vh] overflow-scroll max-w-[70vw] lg:max-w-[60vw] xl:max-w-[45vw]">
          {isloading ? (
            <Loader />
          ) : (
            <>
              <div className="w-full flex flex-col justify-center items-center md:flex-row gap-4 md:justify-evenly mt-3">
                <div>
                  <Input
                    placeholder="Subject Name"
                    className="w-[150px] md:w-30 h-10  border-[2px] border-[black]"
                    value={notes?.subject || ""}
                    onChange={(e) =>
                      setNotes({ ...notes, subject: e.target.value })
                    }
                  />
                </div>
                <div className="">
                  <Select
                    onValueChange={(value) =>
                      setNotes({ ...notes, branch: value })
                    }
                    value={notes?.branch || ""}
                    className=""
                  >
                    <SelectTrigger className="w-[180px] h-10 border-[2px] border-[black]">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Information Technology">
                        Information Technology
                      </SelectItem>
                      <SelectItem value="Electronics and Communication">
                        Electronics and Communication
                      </SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil"></SelectItem>
                      <SelectItem value="Chemical">Chemical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center">
                <form className="gap-x-5" encType="multipart/form-data">
                  <Input
                    type="file"
                    className="cursor-pointer file:bg-[#282f3c] file:px-5 file:py-2 file:rounded-3xl file:mr-5 file:text-[10px] text-[10px] md:text-[16px] md:file:text-[16px] file:text-[white] border-none w-30 h-10"
                    multiple={true}
                    accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .gif, .bmp , .docx, .doc"
                    onChange={(e) => setFiles(e.target.files)}
                  />

                  <div className="mx-auto flex justify-center mt-5">
                    {loading ? (
                      <Button>
                        <span className="spinner"></span>
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => handleUpload(e)}
                        className="h-10 mt-2"
                      >
                        Add Files
                      </Button>
                    )}
                  </div>
                </form>
              </div>
              <div className="flex flex-col gap-3">
                {uploadedFilesList?.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="w-[80%] mx-auto flex justify-between"
                    >
                      <div>
                        <a href={item?.url}>{item?.originalname || ""}</a>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => removeUploadedFile(idx)}
                      >
                        <Trash2 />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center items-center">
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The particular notes will be deleted
              forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleDelete("cancel")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete("continue")}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardContainer;
