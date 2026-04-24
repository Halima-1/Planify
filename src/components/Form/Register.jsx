import { useState } from "react";
import "./Form.css"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabase";
function Register() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  // const userCart = [];
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: ""
  });
  const [errData, setErrData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleValidation = async () => {
    const newErr = {};
    if (!formData.email || !formData.password || !formData.phone) {
      setErrData({ notify: "⚠️ All fields are required." });
      return;
    }

    try {
      // Pass phone to Supabase metadata
      await signup(formData.email, formData.password, {
        data: { phone: formData.phone }
      });

      alert("Registration successful! Please check your email for confirmation or log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message && error.message.includes("already")) {
        newErr.notify = "⚠️ This email is already registered.";
      } else {
        newErr.notify = `⚠️ Signup failed: ${error.message}`;
      }
      setErrData(newErr);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    handleValidation();
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // Supabase OAuth redirects the page by default
    } catch (error) {
      setErrData({ notify: `⚠️ Google Login failed: ${error.message}` });
      console.error("Google Login error:", error);
      setLoading(false);
    }
  };

  // sign out function
  const logOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="register-container">
      {/* <p>{user.name}</p>

      <button onClick={changeUser}>Increase</button> */}

      <form
        className="form"

        action=""
        onSubmit={(event) => {
          handleSubmit(event);
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
          type="tel"
          name="phone"
          value={formData.phone}
          placeholder="phone number"
          onChange={handleChange}
          required
        />
        {/* {errData.cpass && <p style={{ color: "red" }}>{errData.cpass}</p>} */}
        <p style={{ color: "grey" }}>
          Already have an account? <Link to={"/login"}>Sign in</Link>
        </p>
        <input className="submit-btn" disabled={loading}
          type="submit" value={loading ? "Registering..." : "Sign up"} />
        
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
          <hr style={{ flex: 1, border: "0.5px solid #ccc" }} />
          <span style={{ padding: "0 10px", color: "grey", fontSize: "14px" }}>OR</span>
          <hr style={{ flex: 1, border: "0.5px solid #ccc" }} />
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ 
            width: "100%", padding: "10px", backgroundColor: "white", 
            color: "grey", border: "1px solid #ccc", borderRadius: "5px",
            cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
            gap: "10px", fontWeight: "bold"
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "20px" }} />
          Sign up with Google
        </button>
      </form>
      {/* <button onClick={logOut}>sign out</button> */}
    </div>
  );
}

export default Register;
