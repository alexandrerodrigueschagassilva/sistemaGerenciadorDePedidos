var firebaseConfig = {
    apiKey: "AIzaSyAfT89FALIcQxpo9rNkk-822I_I2W-btVk",
    authDomain: "sistemagenerenciadordepedidos.firebaseapp.com",
    databaseURL: "https://sistemagenerenciadordepedidos.firebaseio.com",
    projectId: "sistemagenerenciadordepedidos",
    storageBucket: "sistemagenerenciadordepedidos.appspot.com",
    messagingSenderId: "898413701429",
    appId: "1:898413701429:web:91645020ca9a7cac10447c",
    measurementId: "G-BT4CD70LXL"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database service
var database = firebase.database();