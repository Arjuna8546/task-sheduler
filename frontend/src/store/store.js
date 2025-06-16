import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage" 
import { combineReducers } from "redux"
import User from './slices/UserSlice'

const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = combineReducers({
  user: User,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
})

const persistor = persistStore(store)

export { store, persistor }


