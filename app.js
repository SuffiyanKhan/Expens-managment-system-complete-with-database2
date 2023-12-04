

import { onAuthStateChanged,deleteUser  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { collection, addDoc, onSnapshot, doc, getDoc, deleteDoc, query, orderBy,updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; 
import { db } from './config.js';
import { auth } from './config.js';




onAuthStateChanged(auth, async (user) => {
  if (!user) {
      localStorage.removeItem("UserId")
      location.href = "./signup.html";
  }
});

let text = document.querySelector('#text');
let ammount = document.querySelector('#ammount');
let date = document.querySelector('#date');
let UserId = localStorage.getItem('UserId');
let main = document.querySelector('.main')

let itemsId = 0;
let arr = [];
 
// =============== show expensive =============== //

let Expense =()=>{
    onSnapshot(query(collection(db, UserId),orderBy("Date")), (data) => {
        data.docChanges().forEach((todo) => {
          if (todo.type == "removed") {
            let delLi = document.getElementById(todo.doc.id);
            if (delLi) {
              delLi.remove()
            }
          } else if (todo.type === "added") {
              arr.push(todo.doc.id)
              document.querySelector('.expense1').style.display ='block'
            itemsId++
    main.innerHTML += ` <div class="expense" id="${todo.doc.id}">
    <p id="ids"> ${itemsId}</p>
    <p id="showExpensive">${todo.doc.data().Expense}</p>
    <p>${todo.doc.data().Ammount}</p>
    <p>${todo.doc.data().Date}</p>
    <p onclick ="editdExpense(this, '${todo.doc.id}')"><i class="fa-regular fa-pen-to-square"></i></p>
    <p onclick ="deleteExpense(this, '${todo.doc.id}')"><i class="fa-solid fa-delete-left"></i></p>
</div>`
document.querySelector('#totids').innerHTML= " Total Items :"+ `${itemsId}`

        }
    })
})   
}
 Expense()

// =============== add expensive =============== //

document.querySelector('#addExpense').addEventListener('click',async ()=>{
    try {
        if (text.value == "" || ammount.value == "" || date.value == "") {
            Swal.fire({
              icon: 'error',
              title: '<h3 style="color: #00AD96 ">Oops...</h3>',
              text: 'Fill the field',
              confirmButtonColor: "#00AD96",
            })
          } else{
              const docRef = await addDoc(collection(db, UserId), {
                Expense : text.value,
                Ammount : ammount.value,
                Date : date.value,
                currentTime : new Date().toLocaleString()
              });
          }       
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    text.value ="";
    ammount.value ="",
    date.value =""    
})
//  =============== Edit Exoensive =============== //

let editexpensive=async (e,id)=>{
    let a = prompt('enter value');
    let b = prompt('enter ammount');
    let c = prompt('enter date')
    if(a == "" || b == "" || c ==""){
      alert('wrong')
    }else{
      e.parentElement.children[1].innerHTML = a
      await updateDoc(doc(db, UserId, id),{
          Expense: a,
          Ammount : b,
          Date : c,
          currentTime : new Date().toLocaleString()
      })
    }
}
window.editdExpense = editexpensive

//  =============== delete Expensive =============== //

let deleteExpenseive=async (e,id)=>{
    e.parentElement.remove();
    await deleteDoc(doc(db, UserId, id));
    document.querySelector('#totids').innerHTML=" Total Items :"+ --itemsId

}
window.deleteExpense = deleteExpenseive

// =============== delete all =============== //

document.querySelector('#deleteExpense').addEventListener('click',async ()=>{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete All!',
    cancelButtonText: 'Cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Deleted successfully',
        showConfirmButton: false,
        timer: 4000
      }).then( async() => {
        if (true) {
          main.innerHTML = "";
          for(let i=0; i<arr.length; i++){
              await deleteDoc(doc(db, UserId, arr[i]));
              document.querySelector('#totids').innerHTML= " Total Items :"+ 0

          }
        }
      });
    }
  })
  setTimeout(() => {
    document.querySelector('#refreshDocum').style.display ='block'
    },9000);
})
document.querySelector('#refreshDocum').addEventListener('click',()=>{
  location.reload()
  document.querySelector('#refreshDocum').style.display ='none'

})


//  =============== get currente user details =============== // 

let gname = document.querySelector('#gname');
let gemail = document.querySelector('#gemail');
let gphone = document.querySelector('#gphone')
let usersRef;
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user   
       usersRef = doc(db, "users", userCurrenId);
      const userSnap = await getDoc(usersRef);
      if (userSnap.exists()) {
        console.log(userSnap.data())
        gname.innerHTML = "Name :" + userSnap.data().Name;
        gemail.innerHTML = "Email :" + userSnap.data().Email;
        gphone.innerHTML = "Phone No :" + userSnap.data().Phone_NO
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      // ...
    } else {
      // User is signed out
      window.location ='./signup.html'
      // ...
    }
  });

  //  ==================== get user dateails ==================== //

  let userCurrenId = localStorage.getItem('UserId')
  
  let usersRe;
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      usersRe = doc(db, "users", userCurrenId);
    const userSnap = await getDoc(usersRe);
      if (userSnap.exists()) {
    gname.textContent ="Name :" + userSnap.data().Name ;
    gemail.innerHTML ="Email :" + userSnap.data().Email;
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      // ...
    } else {
      // User is signed out
      window.location ='./signup.html'
      // ...
    }
  });

  // ====================== only logout but account still save in firebase ====================== //

  document.querySelector('#logout').addEventListener('click', async ()=>{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Log out!',
      cancelButtonText: 'Cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Account has been Logout',
          showConfirmButton: false,
          timer: 1500
        }).then( async() => {
          if (true) {
            auth.signOut().then(() => {
              location.href = "./login.html";
            })
          }
        });
      }
    })
    console.log('hi')
  })

// ====================== delete Account from firebase ====================== //

  document.querySelector('#deleteAccount').addEventListener('click',()=>{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Account!',
      cancelButtonText: 'Cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Account has been Logout',
          showConfirmButton: false,
          timer: 1500
        }).then( async() => {
          if (true) {
            await deleteDoc(doc(db, "users", localStorage.getItem("UserId"))); // deleted data of user from firestore.
              deleteUser(auth.currentUser).then( async () => {
                localStorage.remove("UserId");
                location.href = "./signup.html";
                console.log('successfully')
              }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = errorCode.slice(5).toUpperCase();
                const errMessage = errorMessage.replace(/-/g, " ")
            });
          }
        });
      }
    })
    console.log('hi')
  })

  //  =============== hidden popups =============== //
let profilePopup3 = document.querySelector('.profilePopup3')

document.querySelector('#closePopup').addEventListener('click',()=>{
    document.querySelector('.profilePopup').style.display ='none';
    document.querySelector('.profilePopup').style.zIndex =-1;
    document.querySelector('.profilePopup').style.opacity =0
})
document.querySelector('#shoePopup').addEventListener('click',()=>{
    document.querySelector('.profilePopup').style.display ='block';
    document.querySelector('.profilePopup').style.zIndex =1;
    document.querySelector('.profilePopup').style.opacity =1
})
document.querySelector('#updateProfile').addEventListener('click',()=>{
    document.querySelector('.profilePopup4').style.display ='block';
    document.querySelector('.profilePopup4').style.zIndex =1;
    document.querySelector('.profilePopup4').style.opacity =1
})
  document.querySelector('#updaPopup').addEventListener('click',()=>{
    document.querySelector('.profilePopup4').style.display= 'none';
    document.querySelector('.profilePopup4').style.zIndex= -1;
    document.querySelector('.profilePopup4').style.opacity= 0;
  })
  document.querySelector('#updatname').addEventListener('click',()=>{
    document.querySelector('.profilePopup5').style.display= 'block';
    document.querySelector('.profilePopup5').style.zIndex= 1;
    document.querySelector('.profilePopup5').style.opacity=1;
    document.querySelector('.profilePopup4').style.display= 'none';
    document.querySelector('.profilePopup4').style.zIndex= -1;
    document.querySelector('.profilePopup4').style.opacity= 0;
  })
  document.querySelector('#updatphone').addEventListener('click',()=>{
    document.querySelector('.profilePopup6').style.display= 'block';
    document.querySelector('.profilePopup6').style.zIndex= 1;
    document.querySelector('.profilePopup6').style.opacity=1;
    document.querySelector('.profilePopup4').style.display= 'none';
    document.querySelector('.profilePopup4').style.zIndex= -1;
    document.querySelector('.profilePopup4').style.opacity= 0;
  })

//  =================== update name and phone_no =================== //

  let updateName =document.querySelector('#updateName');
let updatePhone = document.querySelector('#updatePhone');
  document.querySelector('#updatnamee').addEventListener('click',async ()=>{
    if(updateName.value == ""){
          alert('wrong')
        }else{
          await updateDoc(usersRef, {
            Name: updateName.value,
        });
        document.querySelector('.profilePopup5').style.display= 'none';
    document.querySelector('.profilePopup5').style.zIndex= -1;
    document.querySelector('.profilePopup5').style.opacity= 0;
        location.reload()
      }
    console.log(updateName.value)
  })
  document.querySelector('#updatemail').addEventListener('click',async ()=>{
    if(updatePhone.value == ""){
      alert('wrong')
    }else{
      await updateDoc(usersRef, {
        Phone_NO : updatePhone.value
    });  
      document.querySelector('.profilePopup6').style.display= 'none';
      document.querySelector('.profilePopup6').style.zIndex= -1;
      document.querySelector('.profilePopup6').style.opacity= 0;
      
    }
    location.reload()
  })