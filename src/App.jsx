import React, { Component } from 'react'
import './App.css'
import { BASEURL, callApi ,setSession} from './api';
class App extends Component {
  constructor(){
    super();
    this.userRegistration = this.userRegistration.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.signin = this.signin.bind(this);
  }
   forgotPassword()
   {
      username.style.border="";
      if(username.value === "")
      {
        username.style.border = "1px solid red";
        username.focus();
        return;
      }
      let url = "http://localhost:8070/users/forgotpassword/"+ username.value;
      callApi("GET", url, "", this.forgotPasswordResponse);

   }

   forgotPasswordResponse(res)
   {
    let data = res.split('::');
    if(data[0] === "200")
      responseDiv.innerHTML = `<br/><br/><label style='color:green'>${data[1]}</label>`;
    else
      responseDiv.innerHTML = `<br/><br/><label style='color:red'>${data[1]}</label>`;
   }

  showsignIn()
  {
    
    let signIn=document.getElementById("signIn");
    let signup=document.getElementById("signup");
    signIn.style.display="block";
    signup.style.display="none";

    let popup=document.getElementById("popup");
    let popupheader=document.getElementById("popupheader");
    popupheader.innerHTML="Login";
    popup.style.display="block";

    username.value="";
    password.value="";
  }

  showsignup()
  {
    let signIn=document.getElementById("signIn");
    let signup=document.getElementById("signup");
    signIn.style.display="none";
    signup.style.display="block";
    
    let popup=document.getElementById("popup");
    let popupheader=document.getElementById("popupheader");
    popupheader.innerHTML="Create New Account";
    popup.style.display="block";
    
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmpassword");

    fullname.value="";
    email.value="";
    role.value="";
    signuppassword.value="";
    confirmpassword.value="";
  }

  closesignIn(event)
  {
    if(event.target.id==="popup")
    {
    let popup=document.getElementById("popup");
    popup.style.display="none";
    }
  }


  userRegistration()
  {
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmpassword");

    fullname.style.border="";
    email.style.border="";
    role.style.border="";
    signuppassword.style.border="";
    confirmpassword.style.border="";

    if(fullname.value === "")
    {
      fullname.style.border = "1px solid red";
      fullname.focus();
      return;
    }
    if(email.value === "")
    {
      email.style.border = "1px solid red";
      email.focus();
      return;
    }
    if(role.value === "")
    {
      role.style.border = "1px solid red";
      role.focus();
      return;
    }
    if(signuppassword.value === "")
    {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }
    if(confirmpassword.value === "")
    {
      confirmpassword.style.border = "1px solid red";
      confirmpassword.focus();
      return;
    }

    if(signuppassword.value !== confirmpassword.value)
    {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }

    var data = JSON.stringify({
      fullname : fullname.value,
      email : email.value,
      role : role.value,
      password : signuppassword.value
    });

    callApi("POST", "http://localhost:8070/users/signup", data, this.getResponse)

  }

  getResponse(res)
  {
    let resp = res.split('::');
    alert(resp[1]);
    if(resp[0] === "200")
    {
      let signIn = document.getElementById("signIn");
      let signup =document.getElementById("signup");
      signup.style.display = "none";
      signIn.style.display = "block";
    }
    alert(res);
  }
  signin()
  {
    username.style.border = "";
    password.style.border = "";
    responseDiv.innerHTML = "";

    if(username.value === "")
    {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }
    if(password.value === "")
      {
        password.style.border = "1px solid red";
        password.focus();
        return;
      }
      let data = JSON.stringify({
        email: username.value,
        password: password.value
      });

      callApi("POST", BASEURL + "users/signin", data, this.signinResponse);
  }

  signinResponse(res)
  {
    let rdata = res.split('::');
    if(rdata[0] === "200")
    {
      setSession("csrid", rdata[1], 1);
      window.location.replace("/dashboard");
    }
    else
    {
      responseDiv.innerHTML = `<br/><br/><label style="color:red>${rdata[1]}</label>`;
    }
  }
  
  render() {
    return (
      <div id='container'>
        <div id='popup' onClick={this.closesignIn}>
          <div id='popupwindow'>
              <div id='popupheader'>
                Login
              </div>
              
              <div id='signIn'>
                <label className='usernamelabel'>Username*</label>
                <input type='text' id='username' />
                <label className='passwordlabel'>Password*</label>
                <input type='password' id='password' />
                <div className='forgotpassword'>Forgot <label onClick={this.forgotPassword}>Password?</label></div>
                <button className='signinbutton' onClick={this.signin}>Sign In</button>
                <div className='div1' id='responseDiv'></div>
                <div className='div2'>
                  Don't Have an Account
                  <label onClick={this.showsignup}>SignUp Now </label>
                </div>
              </div>

              <div id='signup'>
                <label>Full Name</label>
                <input type='text' id='fullname'/>
                <label>Email</label>
                <input type='text' id='email'/>
                <label>Select Role</label>
                <select id='role'>
                    <option value=''></option>
                    <option value='1'>Admin</option>
                    <option value='2'>Employee</option>
                    <option value='3'>Job Seeker</option>
                </select>
                <label>Password*</label>
                <input type='password' id='signuppassword' />
                <label>Confirm Password*</label>
                <input type='password' id='confirmpassword' />
                <button onClick={this.userRegistration}>Register</button>
                <div>Already have an account? <span onClick={this.showsignIn}>SIGN IN</span></div>

              </div>
          </div>
        </div>
        <div id='header'>
            <img className='logo' src='/logo.png' alt='' />
            <div className='logotext'><span>Job</span> Portal</div>
            <img className='signicon' src='/user.png' alt='' onClick={this.showsignIn}/>
            <label className='signtext' onClick={this.showsignIn}>Sign In</label>
        </div>
        <div id='content'>
          <div className='text1'>INDIA'S #1 JOB PLATFORM</div>
          <div className='text2'>Your Job search ends here</div>
          <div className='text3'>Discover career opportunities</div>
          <div className='searchbar'>
            <input type='text' className='searchtext' placeholder='Search by "skill"' />
            <input type='text' className='searchlocation' placeholder='Job Location' />
            <button className='searchbutton'>Search jobs</button>
          </div>
        </div>

        <div id='footer'>
          <label className='copyrighttext'>Copyright @ 2024. All rights reserved.</label>
          <img className='socialmediaicon' src='facebook.png' alt=''/>
          <img className='socialmediaicon' src='twitter.png' alt=''/>
          <img className='socialmediaicon' src='linkedin.png' alt=''/>
        </div>
      </div>
    )
  }
}

export default App;