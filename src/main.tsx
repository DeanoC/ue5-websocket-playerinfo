import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store'; // Make sure path is correct
import App from './App';
import './index.css';

// Wait for the DOM to be fully loaded before rendering the React app
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app');
  
  if (rootElement) {
    // Render the main application component
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
    );

    // Dispatch an initial action to trigger middleware execution
    // (This ensures ipcMiddleware runs and sets up listeners)
    store.dispatch({ type: 'APP_INIT' }); 
    console.log('[main.tsx] React app rendered and initial action dispatched.'); // Optional: Add log
  } else {
    console.error('Failed to find the root element. React app mount failed.');
  }
});