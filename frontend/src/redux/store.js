import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import serviceReducer from "./serviceSlice";

const persistConfig = {
  key: "servicemate",
  version: 2,
  storage,
  stateReconciler: autoMergeLevel2, // Add this line
};
const rootReducer = combineReducers({
  user: userSlice,
  service: serviceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
