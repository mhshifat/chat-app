import { configureStore } from '@reduxjs/toolkit'
import authSlice from "./authSlice";
import conversationSlice from "./conversationSlice";

export const store = configureStore({
  reducer: {
    authSlice,
    conversationSlice
  },
  middleware: (defaultMiddleware) => defaultMiddleware({
    serializableCheck: false
  }) 
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch