import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

// import { UserContext } from "../App";
function Login() {
  // const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errData, setErrData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleValidation =async () => {
    const newErr = {};
    setLoading(true)
    if (!formData.email || !formData.password) {
      newErr.notify ="⚠️ All fields are required.";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // alert("✅ Login successful!");
      toast.success("Login successful! 🎉");
      navigate("/", { replace: true });

    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("⚠️ No account found with this email."); // Show Firebase error as toast
        newErr.notify="⚠️ No account found with this email.";}
      else if(error.code === "auth/too-many-requests") {
        toast.error("Too many failed login attempts. Please try again later.");
      } else if (error.code === "auth/wrong-password") {
        toast.error('⚠️ Incorrect password. Please try again.')
        newErr.notify ="⚠️ Incorrect password. Please try again.";
      }
      else if (error.code === "auth/invalid-credential") {
        toast.error('⚠️ Invalid credentials, please try again.')
        newErr.notify ="⚠️ Invalid credentials, please try again.";
      }
       else {
        toast.error("⚠️ Login failed. Please try again.")
        newErr.notify ="⚠️ Login failed. Please try again.";
      }
      console.error("Firebase login error:", error.code, error.message);
    // alert(error.message);
    setErrData(newErr);

    }
    finally {
      setLoading(false); // stop loading
    }
    
  };
  const handleSubmit =  () => {
    handleValidation()
    if (!errData) {
      // navigate("/", { replace: true });
      return
    }
    localStorage.setItem("oldUser",formData.email)
    console.log(errData)

  };

  return (
    <div className="register-container">
      {/* <p>{user.name}</p>
      <button onClick={changeUser}>Increase</button> */}
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <h2 style={{ color: "navy", marginBottom: 30 }}>Sign In</h2>
        {loading && <div className="spinner"></div>}
        {/* {errData.notify && <p style={{ color: "green" }}>{errData.notify}</p>} */}
        {/* {errData.notify && <p style={{ color: "red" }}>{errData.notify}</p>} */}
        <ToastContainer position="top-center" autoClose={3000} />
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="email"
          onChange={handleChange}
          disabled={loading} // disable while loading
        />
        {/* {errData.email && <p style={{ color: "red" }}>{errData.email}</p>} */}

        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
          disabled={loading} 

        />
        {errData.password && <p style={{ color: "red" }}>{errData.password}</p>}
        <p style={{ color: "grey" }}>
          No account yet? <Link to={"/register"}>Sign Up</Link>
        </p>
        <input className="submit-btn"           disabled={loading}
 type="button" onClick={handleSubmit} value={loading ? "Logging in..." : "Login"} />
      </form>
    </div>
  );
}

export default Login;
