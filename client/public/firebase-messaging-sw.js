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
// const messages = firebase.getMessagging()
console.log("messaging",messaging)

messaging.onBackgroundMessage(function (payload) {


  const { title, body, icon } = payload.notification;

  console.log("title",title)
  console.log("body",body)

  self.registration.showNotification(title, {
    body: body,
    icon: icon || 'default-icon.png',
  })
})

// onMessage can't be used here in the serviceWorker , foreground messages can't be sent from the service worker, they have to be used in the App.jsx, root.jsx or main.jsx

/* messaging.onMessage((payload) => {
  const {title,body} = payload.data;  
  console.log("title",title)
  console.log("body", body);
  // console.log("Title:", payload.notification?.title); // Only works if notification payload was sent
}); */