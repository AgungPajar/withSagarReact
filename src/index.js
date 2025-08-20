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
      title: 'Update E - OSSAGAR',
      text: "Versi baru dari web ini tersedia, update sekarang!",
      icon: 'info',
      confirmButtonText: 'Lanjutkan',
      timer: 4000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
      const listener = () => {
        window.location.reload()
        navigator.serviceWorker.addEventListener('controllerchange', listener)
      }
      navigator.serviceWorker.addEventListener('controllerchange', listener)

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
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    });
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
