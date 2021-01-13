var firebaseConfig = {
  apiKey: "AIzaSyBoagR3qP7d0vb3Q6pXS-7MjDvhhhjt1dk",
  authDomain: "chamadordepedidos.firebaseapp.com",
  databaseURL: "https://chamadordepedidos.firebaseio.com",
  projectId: "chamadordepedidos",
  storageBucket: "chamadordepedidos.appspot.com",
  messagingSenderId: "173510588155",
  appId: "1:173510588155:web:bfd00db073ec923174a25e",
  measurementId: "G-BX3GWYR6W1"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database service
var database = firebase.database();