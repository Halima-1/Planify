import { useState } from "react";
import "./register.css"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  signInWithPopup} from "firebase/auth";
import { async } from "@firebase/util";
function Register() {
  const navigate = useNavigate()
    // const userCart = [];
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: ""
  });
  const [errData, setErrData] = useState({});

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleValidation =async()=>{
    const newErr = {};

    try {
      // check if email already exists
      const providers = await fetchSignInMethodsForEmail(auth, formData.email);
  
      if (providers.length > 0) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("Logged in:", userCredential.user);
        alert("Welcome back! You are logged in.");
        navigate("/login", { replace: true });
      } else {
        // new user -> create account
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password, formData.phoneNumber);
        console.log("New account created:", userCredential.user);
        navigate("/login", { replace: true });
      }
    } catch (error) {

      if (error.code === "auth/email-already-in-use") {
        newErr.notify="⚠️ This email is already registered. Please log in instead.";
      } else if (error.code === "auth/invalid-email") {
        newErr.notify ="⚠️ Please enter a valid email address.";
      } else if (error.code === "auth/missing-password") {
        newErr.notify ="⚠️ Please input a password.";
      } 
      else if (error.code === "auth/weak-password") {
        newErr.notify ="⚠️ Password must be at least 6 characters long.";
      } 
      else {
        newErr.notify ="⚠️ Something went wrong. Please try again.";
      }
      
      console.error(error);
      setErrData(newErr)
      // alert(error.message);
    } 
  }
  const signIn = (e)=>{
    e.preventDefault()
        handleValidation();
    if (!errData) {
      console.log('log in successful');

        }
     }

// signing in with google
const signInWithGoogle = async() =>{
try {
  await signInWithPopup(auth,googleProvider)
} catch(err){
  console.error(err)
}
}

// sign out function
const logOut = async() =>{
  try {
    await signOut(auth)
  } catch(err){
    console.error(err)
  }
}
  return (
    <div className="register-container">
      {/* <p>{user.name}</p>

      <button onClick={changeUser}>Increase</button> */}

      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          signIn();
        }}
      >
        <h2 style={({ color: "navy", marginBottom: 30 })}>Sign up</h2>
        {errData.notify && <p style={{ color: "red" }}>{errData.notify}</p>}

        {errData.fname && <p style={{ color: "red" }}>{errData.fname}</p>}
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="email"
          onChange={handleChange}
        />
       
        {errData.phone && <p style={{ color: "red" }}>{errData.phone}</p>}
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
        />
        {/* {errData.password && <p style={{ color: "red" }}>{errData.password}</p>} */}
        <input
          type="number"
          name="num"
          value={formData.phoneNumber}
          placeholder="phone number"
          onChange={handleChange}
          required
        />
        {/* {errData.cpass && <p style={{ color: "red" }}>{errData.cpass}</p>} */}
        <p style={{ color: "grey" }}>
          Already have an account? <Link to={"/login"}>Sign in</Link>
        </p>
        <input className="submit-btn" type="submit" onClick={signIn} value={"Sign up"} />
      </form>
{/* 
      <button className='google' onClick={signInWithGoogle}>
                    <b>Sign up with google</b> <br />
                    <img src="../../src/assets/google logo.png" alt="google logo" />                   
                </button> */}
                {/* <button onClick={logOut}>sign out</button> */}
    </div>
  );
}

export default Register;
