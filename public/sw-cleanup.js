// // Cleanup script per rimuovere il service worker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.getRegistrations().then(function(registrations) {
//     for(let registration of registrations) {
//       registration.unregister();
//       console.log('Service Worker unregistered:', registration);
//     }
//   });
  
//   // Pulisci anche la cache
//   caches.keys().then(function(cacheNames) {
//     cacheNames.forEach(function(cacheName) {
//       caches.delete(cacheName);
//       console.log('Cache deleted:', cacheName);
//     });
//   });
// }