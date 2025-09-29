import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Swal from 'sweetalert2'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const promptUserToUpdate = (registration) => {
  if (registration && registration.waiting) {
    Swal.fire({
      title: 'Updating...',
      text: 'Proses update, Ditunggu ya guys...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

serviceWorkerRegistration.register({
  onUpdate: registration => {
    promptUserToUpdate(registration)
  },
});

navigator.serviceWorker.ready.then(registration => {
  if (registration.waiting) {
    promptUserToUpdate(registration)
  }
})

reportWebVitals();
