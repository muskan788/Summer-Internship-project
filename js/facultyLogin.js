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

function signInWithEmailPassword() 
{
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => 
    {
      // Signed in 
      document.getElementById('facultyLoginForm').reset();
      fieldValidation(email, password);
      window.location.replace("facultyPage.html");
      // ...
    }).catch((error) => 
    {
      switch (error.code) 
      {
        case "auth/invalid-email":
        case "auth/wrong-password":
        case "auth/user-not-found":
          {
            this.accountErrorMessage = "Wrong email address or password.";
            break;
          }
        case "auth/user-disabled":
        case "user-disabled":
          {
            this.accountErrorMessage = "This account is disabled";
            break;
          }
        }
        window.alert(accountErrorMessage);
        document.getElementById('facultyLoginForm').reset();
    });
}

function fieldValidation(user, pwd)
{
    if(user && pwd && pwd.length > 8)
    {
      return true;
    } 
    else if (user && pwd && pwd.length < 8) 
    {
      alert("Password length should be minimum 8");
      console.log("Login validation password legth failed for user :"+user);
    } 
    else 
    {
      console.log("Login validation failed for user :"+user);
    }
    return false;
}