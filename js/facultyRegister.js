const firebaseConfig = {
  apiKey: "AIzaSyC97NW-btuTa2CdmvmD1qDK9R3JaLxwpNg",
  authDomain: "poattainment.firebaseapp.com",
  databaseURL: "https://poattainment-default-rtdb.firebaseio.com",
  projectId: "poattainment",
  storageBucket: "poattainment.appspot.com",
  messagingSenderId: "401193223106",
  appId: "1:401193223106:web:1eb42d82c026cbae018c5b",
  measurementId: "G-9BY3G20HVG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
  var messagesRef = firebase.database().ref('users');
  document.getElementById('facultyRegisterForm').addEventListener('submit', submitForm);
  
  // Submit form
  function submitForm(e){
    e.preventDefault();
  
    var privatecode = getInputVal('privatecode');
    var password = getInputVal('password');
    var fullname = getInputVal('fullname');
    var email = getInputVal('email');
  
    if(privatecode == "InHouse")
      writeUserData(privatecode, password, fullname, email);
  
  function getInputVal(id){
    console.log(document.getElementById(id).value);
    return document.getElementById(id).value;
  }
  
  // Save message to firebase
  function writeUserData(username, password, fullname, email){
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
      username: username,
      password: password,
      fullname: fullname,
      email: email
    });
  }
  }
  
  function signUpWithEmailPassword() 
  {
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      var privatecode = document.getElementById("privatecode").value;
  
      if(privatecode == "InHouse")
      {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => 
        {
          // Signed in 
          document.getElementById('facultyRegisterForm').reset();
          window.alert("Successfully registered");
          window.location.replace("facultyPage.html");
          // ...
        })
        .catch((error) => 
        {
          var errorCode = error.code;
          var errorMessage = error.message;
          window.alert(errorMessage);
          document.getElementById('facultyRegisterForm').reset();
          // ..
        });
      }
      else{
        alert("Wrong private code");
        document.getElementById('facultyRegisterForm').reset();
      }
  }
  
  