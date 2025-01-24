import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  getNotesLoading:false,
  getNotesDetailLoading:false,
  notesList: [],
  notesDetail: null,
};

export const getAllNotes = createAsyncThunk("/admin/getallnotes", async (params) => {
  const token = localStorage.getItem("user");
  
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/getallnotes?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  const data = await response.json();
  return data;
});

export const changeStatus=createAsyncThunk("/admin/changestatus",async(formData)=>{
  const token = localStorage.getItem("user");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/changestatus`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(formData),
    }
  );
  const data = await response.json();
  return data;
})

export const deleteNotes=createAsyncThunk("/admin/deletenotes",async(id)=>{
  const token = localStorage.getItem("user");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/deletenotes`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({notesId:id}),
    }
  );
  const data = await response.json();
  return data;
})


const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotes.pending, (state) => {
        state.getNotesDetailLoading= true;
        state.getNotesLoading=true
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.getNotesLoading = false;
        state.notesList = action?.payload?.success
          ? action?.payload?.notes
          : [];
      })
      .addCase(getAllNotes.rejected, (state) => {
        state.getNotesLoading= false;
      })
  },
});

export const { setNotes } = notesSlice.actions;
export default notesSlice.reducer;
