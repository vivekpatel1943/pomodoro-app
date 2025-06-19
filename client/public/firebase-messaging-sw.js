// import firebase from 'firebase';


importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

console.log("firebase",firebase);
if(!firebase.apps.length){
  firebase.initializeApp({
  apiKey: "AIzaSyCJ1Rj_L5RMuCu0A3UxjpT1Sazyl1ED5MM",
  authDomain: "pomodoro-app-8ad4e.firebaseapp.com",
  projectId: "pomodoro-app-8ad4e",
  messagingSenderId: "440506009031",
  appId: "1:440506009031:web:46ef6c9d683803182f85e2"
})
}



const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  const { title, body, icon } = payload.notification;

  self.registration.showNotification(title, {
    body: payload.notification.body,
    icon: icon || 'default-icon.png',
  })
})

messaging.onMessage(messaging, (payload) => {
  console.log("Payload received:", payload);
  console.log("Title:", payload.notification?.title); // Only works if notification payload was sent
});