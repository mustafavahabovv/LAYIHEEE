import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendSupportMessage = createAsyncThunk(
  "support/sendSupportMessage",
  async (formData) => {
    const res = await axios.post(
      "http://localhost:5000/api/support/send", // ✅ BURANI DƏYİŞ
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);


const supportSlice = createSlice({
  name: "support",
  initialState: { loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(sendSupportMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendSupportMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSupportMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default supportSlice.reducer;
