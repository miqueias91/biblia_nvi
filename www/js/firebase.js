// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC3p53Li69qyVzvLfZY12ePNwbCD_AACqQ",
  authDomain: "biblia-sagrada-nvi-4be54.firebaseapp.com",
  databaseURL: "https://biblia-sagrada-nvi-4be54.firebaseio.com",
  projectId: "biblia-sagrada-nvi-4be54",
  storageBucket: "biblia-sagrada-nvi-4be54.appspot.com",
  messagingSenderId: "144799182566",
  appId: "1:144799182566:web:2da57e9fb1b00bec645527",
  measurementId: "G-PLHG0D2J67"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().signInAnonymously().catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  alert(errorMessage)
});