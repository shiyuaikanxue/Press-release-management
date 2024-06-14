import { configureStore, combineReducers } from "@reduxjs/toolkit";
import collapReducer from "./slice/collapSlice";
import loadingReducer from "./slice/loadingSlice";
import loginReducer from "./slice/loginedSlice";
import storage from "redux-persist/lib/storage"; // 默认使用localStorage
import { persistStore, persistReducer } from "redux-persist";
const rootReducer = combineReducers({
  collap: collapReducer,
  loading: loadingReducer,
  login: loginReducer,
});
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export default store;
