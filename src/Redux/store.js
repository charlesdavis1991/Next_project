import rootReducer from "./rootReducer";
import { thunk } from "redux-thunk";
import { configureStore, Tuple } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from 'redux-persist'

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['acts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: () => new Tuple(thunk),
});

let persistor = persistStore(store);
export { persistor }
export default store;
