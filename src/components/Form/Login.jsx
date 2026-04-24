import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Form.css";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

// import { UserContext } from "../App";
function Login() {
  const { login, loginWithGoogle } = useAuth();
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

  const handleValidation = async () => {
    const newErr = {};
    setLoading(true)
    if (!formData.email || !formData.password) {
      newErr.notify = "⚠️ All fields are required.";
      return;
    }

    try {
      await login(formData.email, formData.password);
      // alert("✅ Login successful!");
      toast.success("Login successful! 🎉");
      navigate("/", { replace: true });

    } catch (error) {
      if (error.message && error.message.includes("Invalid login credentials")) {
        toast.error("⚠️ Invalid credentials, please try again.");
      } else if (error.message && error.message.includes("Email not confirmed")) {
        toast.error("✉️ Please confirm your email before logging in.");
      } else if (error.message && error.message.includes("too many")) {
        toast.error("Too many failed login attempts. Please try again later.");
      } else {
        toast.error(`⚠️ Login failed: ${error.message}`);
      }
      console.error("Login error:", error);
      setErrData({ notify: error.message });
    }
    finally {
      setLoading(false); // stop loading
    }

  };
  const handleSubmit = () => {
    handleValidation()
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // Supabase OAuth redirects the page by default, so we won't see a success toast instantly here
    } catch (error) {
      toast.error(`⚠️ Google Login failed: ${error.message}`);
      console.error("Google Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* <p>{user.name}</p>
      <button onClick={changeUser}>Increase</button> */}
      <form
        className="form"
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
        <input className="submit-btn" disabled={loading}
          type="submit" value={loading ? "Logging in..." : "Login"} />
        
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
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

export default Login;
