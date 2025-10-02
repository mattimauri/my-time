// import { useCallback } from "react";

// // 👉 La tua VAPID public key (dal backend)
// const VAPID_PUBLIC_KEY = 'BAM0nwAH4zALBmCKQQytMiAznzFtwzbsonldhMb4tjXIEDxLggAFWMrPrR0ab22O9Nx36IQtHUqT-BnaI7sHkvc';

// export function usePushSubscription() {
//   const subscribeUser = useCallback(async (token) => {
//     if (!("serviceWorker" in navigator)) {
//       console.warn("Service Worker non supportato");
//       return;
//     }
//     if (!("PushManager" in window)) {
//       console.warn("Push API non supportata");
//       return;
//     }

//     try {
//       // 1️⃣ Registrazione SW
//       const registration = await navigator.serviceWorker.ready;

//       // 2️⃣ Richiesta permesso
//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") {
//         console.warn("Permesso notifiche negato");
//         return;
//       }

//       // 3️⃣ Creazione subscription
//       const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
//       });

//       // 4️⃣ Salvataggio sul backend
//       const res = await fetch(
//         `https://z098--secure-api--9467bf7t4qkk.code.run/api/api/save-subscription`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // 👈 JWT
//           },
//           body: JSON.stringify({ subscription }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Errore salvataggio subscription");
//       }

//       console.log("✅ Subscription salvata con successo!");
//     } catch (err) {
//       console.error("❌ Errore gestione subscription:", err);
//     }
//   }, []);

//   return { subscribeUser };
// }

// // Utility: converte la chiave VAPID base64 in Uint8Array
// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
