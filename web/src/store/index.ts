import { configureStore } from '@reduxjs/toolkit'
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    authSlice
  },
  middleware: (defaultMiddleware) => defaultMiddleware({
    serializableCheck: false
  }) 
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch