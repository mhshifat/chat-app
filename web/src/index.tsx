import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routes from './routes';
import { Provider } from "react-redux";
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import SocketProvider from './providers/socket';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <SocketProvider>
        <Routes />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);

