import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
  }

const persistedUser =  persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedUser,
      },
  })


  export const persistore = persistStore( store );


