import { configureStore, combineReducers } from "@reduxjs/toolkit";
import collapReducer from "./slice/collapSlice";
import loadingReducer from "./slice/loadingSlice";
import storage from "redux-persist/lib/storage"; // 默认使用localStorage
import { persistStore, persistReducer } from "redux-persist";
const rootReducer = combineReducers({
  collap: collapReducer,
  loading: loadingReducer,
});
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading"], // 你可以指定不想被持久化的 reducer
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
});
export default store;
