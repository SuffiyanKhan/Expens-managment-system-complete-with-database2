
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {setDoc,  doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; 
import{db} from "./config.js";
import{auth} from "./config.js";

let btn = document.querySelector('.signup');
btn.addEventListener('click',()=>{
    let sname = document.querySelector('#sname');
    let semail = document.querySelector('#semail');
    let spassword = document.querySelector('#spassword');
    let sphoneNo = document.querySelector('#sphoneNo')
    let email = semail.value;
    let password = spassword.value;
    createUserWithEmailAndPassword(auth, email, password)
  .then( async(userCredential) => {
    // Signed up 
    const user = userCredential.user;
    try {
        const docRef = await setDoc(doc(db, "users",  user.uid ),{
            Name : sname.value,
            Email: email,
            Password: password,
            Phone_NO : sphoneNo.value,
          uid: user.uid
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Signup has been Succeessfully',
          showConfirmButton: false,
          timer: 1500
        }).then(() =>{
          if(true){
            window.location ='./login.html'
          }
        })
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    // ...
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
})
//  ======================= google authentication ======================= //

document.querySelector('#google').addEventListener('click',()=>{
  const provider = new GoogleAuthProvider();     
  signInWithPopup(auth, provider)
.then(async (result) => {
const credential = GoogleAuthProvider.credentialFromResult(result);
const token = credential.accessToken;
const user = result.user;
let userData = {
  Name: user.displayName,
  Email: user.email,
  Phone_NO : "",
};
await setDoc(doc(db, "users", user.uid), {
  // collection name,   unique id of user
  ...userData, // setting array in a database
  userid: user.uid, // also user id in the database
});
localStorage.setItem("UserId", user.uid);
location.href = "./index.html";
})
.catch((error) => {
// Handle Errors here.
const errorCode = error.code;
const errorMessage = error.message;
});
})