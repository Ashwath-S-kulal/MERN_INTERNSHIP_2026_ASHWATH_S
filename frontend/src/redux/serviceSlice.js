import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    provider: null,
    providers: [], // 🔥 list of providers
    loading: false,
  },
  reducers: {
    setProvider(state, action) {
      state.provider = action.payload;
    },
    setProviders(state, action) {
      state.providers = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setProvider, setProviders, setLoading } = serviceSlice.actions;
export default serviceSlice.reducer;