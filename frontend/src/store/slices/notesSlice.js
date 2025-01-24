import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  notesList: [],
  userNotesList: [],
  notesDetail: null,
  hasLiked: false,
  hasDisliked: false,
  loading_comment:false,
  getNotesLoading:false,
  getNotesDetailLoading:false
};

export const addNotes = createAsyncThunk(
  "/notes/addnotes",
  async (formData) => {
    const token = localStorage.getItem("user");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/notes/addnotes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const getUserNotes = createAsyncThunk(
  "/notes/getusernotes",
  async (params) => {
    const token = localStorage.getItem("user");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/notes/getusernotes/?${params}`,
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
  }
);

export const getAllNotes = createAsyncThunk("/notes/getallnotes", async (params) => {
  const token = localStorage.getItem("user");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/notes/getallnotes?${params}`,
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

export const getNotesDetail = createAsyncThunk(
  "/notes/getnotesdetail",
  async (id) => {
    const token = localStorage.getItem("user");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/notes/getnotesdetail/${id}`,
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
  }
);

export const editNotes = createAsyncThunk(
  "/notes/editnotes",
  async (formData) => {
    const token = localStorage.getItem("user");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/notes/editnotes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const likeDislike = createAsyncThunk(
  "/notes/likeDislike",
  async (formData) => {
    const token = localStorage.getItem("user");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/notes/likedislike`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const addComments = createAsyncThunk(
  "/comments/addcomments",
  async (formData) => {
    const token = localStorage.getItem("user");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/addcomments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const deleteNotes=createAsyncThunk("/notes/deletenotes",async(id)=>{
  const token = localStorage.getItem("user");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/notes/deletenotes`,
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
      .addCase(addNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNotes.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNotes.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserNotes.pending, (state) => {
        state.isLoading = true;
        state.getNotesLoading=true;
      })
      .addCase(getUserNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userNotesList = action?.payload?.success
          ? action?.payload.notes
          : [];
          state.getNotesLoading=false
      })
      .addCase(getUserNotes.rejected, (state) => {
        state.isLoading = false;
        state.getNotesLoading=false
      })
      .addCase(getNotesDetail.pending, (state) => {
        state.isLoading = true;
        state.getNotesDetailLoading=true
      })
      .addCase(getNotesDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getNotesDetailLoading=false
        state.notesDetail = action?.payload?.success
          ? action?.payload.notesDetail
          : null;
        (state.hasLiked = action?.payload?.success
          ? action?.payload?.hasLiked
          : false),
          (state.hasDisliked = action?.payload?.success
            ? action?.payload?.hasDisliked
            : false);
      })
      .addCase(getNotesDetail.rejected, (state) => {
        state.isLoading = false;
        state.getNotesDetailLoading=false
      })
      .addCase(editNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editNotes.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editNotes.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllNotes.pending, (state) => {
        state.isLoading = true;
        state.getNotesLoading=true
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notesList = action?.payload?.success
          ? action?.payload?.notes
          : [];
          state.getNotesLoading=false
      })
      .addCase(getAllNotes.rejected, (state) => {
        state.isLoading = false;
        state.getNotesLoading=false
      })
      .addCase(likeDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeDislike.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(likeDislike.rejected, (state) => {
        state.isLoading = false;
      }).addCase(addComments.pending, (state) => {
        state.loading_comment=true
      })
      .addCase(addComments.fulfilled, (state) => {
        state.loading_comment=false
      })
      .addCase(addComments.rejected, (state) => {
        state.loading_comment=false
      }).addCase(deleteNotes.pending, (state) => {
        state.isLoading=true
      })
      .addCase(deleteNotes.fulfilled, (state) => {
        state.isLoading=false
      })
      .addCase(deleteNotes.rejected, (state) => {
        state.isLoading=false
      })
  },
});

export const { setNotes } = notesSlice.actions;
export default notesSlice.reducer;
