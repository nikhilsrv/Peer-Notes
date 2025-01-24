import React, { useState } from "react";
import { toast } from "./use-toast";

export const useDownload = () => {
  const [loading_downloading, setLoading] = useState(false);

  const download = async (files) => {
    try {
      setLoading(true)
      const token = localStorage?.getItem("user");
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notes/download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/zip",
            Authorization: token,
          },
          body: JSON.stringify(files),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const zipUrl = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = zipUrl;
        anchor.download = "files.zip";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(zipUrl);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setLoading(false)
      toast({title:"Something went wrong while downloading !",variant:"destructive"})
    }finally{
      setLoading(false)
    }
  };

  return { loading_downloading, download };
};
