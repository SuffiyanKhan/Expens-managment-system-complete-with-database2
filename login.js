import { signInWithEmailAndPassword , sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import{auth} from "./config.js";

document.querySelector('#login').addEventListener('click',()=>{
    let email = document.querySelector('#lemail');
    let password = document.querySelector('#lpassword');
    if(email.value == ""){
        Swal.fire({
          icon: 'error',
          title: '<h3 style="color: #00AD96 ">Oops...</h3>',
          text: "Please fill the field",
          confirmButtonColor: "#00AD96",
          iconColor: '#00AD96',
        })
        console.log('wrong')
    }else{
        console.log(email.value)
        signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user.uid)
    localStorage.setItem('UserId',user.uid)
    sendEmailVerification(auth.currentUser)
  .then(() => {
    // Email verification sent!
    console.log('successfully')
    // ...
  });
    Swal.fire({
      icon: 'success',
      title: '<h3 style="color: #00AD96 ">Great! You are now logged in. Click OK to proceed.</h3>',
      confirmButtonColor: "#00AD96",
    }).then(()=>{
      if(true){
        window.location="./index.html"
      }
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = errorCode.slice(5).toUpperCase();
    const errMessage = errorMessage.replace(/-/g, " ");
    Swal.fire({
        icon: 'error',
        title: '<h3 style="color: #00AD96 ">Oops...</h3>',
        text: errMessage,
        confirmButtonColor: "#00AD96",
        iconColor: '#00AD96',
      })
  });
    }
})

