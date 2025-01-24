import React, { useState } from "react";

export const useUploadFiles = () => {
  const [loading, setloading] = useState(false);

  const uploadFiles = async (formData) => {
    try {
      setloading(true)  
      const token = localStorage?.getItem("user") || "";
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notes/uploadfiles`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Accept-Type": "application/json",
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
    }finally{
        setloading(false)
    }
  };

  return { loading, uploadFiles };
};
