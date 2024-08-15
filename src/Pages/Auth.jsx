import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "../AxiosInstance/AxiosInstance";
import { useFirebase } from "../firebase/firebase.config";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import Loader from "../Component/loder";
const Auth = () => {
  const [showSignUP, setSignUp] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verficationEmail, setVerficationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const initialLoginFormValues = {
    email: "",
    password: "",
  };
  const initialSignUpFormValues = {
    userId: "",
    Username: "",
    userType: "CUSTOMER",
    email: "",
    password: "",
  };

  const { firebaseSignUp, firebaseSignIn, sendVerficationEmail } =
    useFirebase();

  const [LoginFormValues, setLoginFormValues] = useState(
    initialLoginFormValues
  );
  const [SignUpFormValues, setSignUpFormValues] = useState(
    initialSignUpFormValues
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await AxiosInstance.post("/crm/api/v1/auth/signin", {
        email: LoginFormValues.email,
        password: LoginFormValues.password,
      });
      await firebaseSignIn(LoginFormValues.email, LoginFormValues.password);
      localStorage.setItem("name", data.name);
      localStorage.setItem("userid", data.userId);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userStatus", data.userStatus);
      localStorage.setItem("token", data.accessToken);

      toast.success("Welcome to the app!");
      switch (data.userType) {
        case "CUSTOMER":
          navigate("/customer");
          break;
        case "ENGINEER":
          navigate("/engineer");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
      }
      toast.success("Login Successfull");
      setIsLoading(true);
    } catch (ex) {
      toast.error(ex.response.data.message);
      seterrorMessage(ex.response.data.message);
    }
  };
  async function handleSignUp(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await AxiosInstance.post("/crm/api/v1/auth/signup", {
        userId: SignUpFormValues.userId,
        password: SignUpFormValues.password,
        name: SignUpFormValues.Username,
        email: SignUpFormValues.email,
        userType: SignUpFormValues.userType,
      });

      setSignUp(false);
      toast.success("Sign-up successful please login to continue");
      setIsLoading(false);
    } catch (ex) {
      toast.error(ex.response.data.message);
      seterrorMessage(ex.response.data.message);
    }
  }

  const toggleSignUp = () => {
    setSignUp(!showSignUP);
  };

  function handleLoginFromChange(event) {
    setLoginFormValues({
      ...LoginFormValues,
      [event.target.name]: event.target.value,
    });
  }

  function handleSignUpFormChange(event) {
    setSignUpFormValues({
      ...SignUpFormValues,
      [event.target.name]: event.target.value,
    });
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      switch (localStorage.getItem("userTypes")) {
        case "CUSTOMER":
          navigate("/customer");
          break;
        case "ENGINEER":
          navigate("/engineer");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
      }
    }
  }, []);

  async function handleVerficationEmail(verficationEmail) {
    try {
      await sendVerficationEmail(verficationEmail);
      toast.success("password reset link sent to registered email");
      localStorage.setItem("verfication_email", verficationEmail);
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div id="login-page">
      <div className="bg-primary d-flex justify-content-center align-item-center vh-100">
        <div className="card m-auto p-3">
          <div className="row m-2">
            <div className="col">
              {forgotPassword ? (
                <div>
                  <h4 className="text-center mb-3">Forgot password</h4>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      value={verficationEmail}
                      onChange={(event) =>
                        setVerficationEmail(event.target.value)
                      }
                      className="form-control"
                      required
                      placeholder="registered email"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleVerficationEmail(verficationEmail)}
                  >
                    send verfication email
                  </button>
                </div>
              ) : !showSignUP ? (
                <div>
                  <h4 className="text-center">Login</h4>
                  <form onSubmit={handleLogin}>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        name="email"
                        placeholder="enter your email"
                        className="form-control"
                        value={LoginFormValues.email}
                        onChange={handleLoginFromChange}
                        required
                      />
                    </div>
                    <div className="input-group m-1 d-flex justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="enter your password "
                        className="form-control"
                        onChange={handleLoginFromChange}
                        value={LoginFormValues.password}
                        required
                      />
                      <div
                        className="icon"
                        style={{
                          position: "absolute",
                          right: "8px",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          zIndex: "100",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VscEyeClosed /> : <VscEye />}
                      </div>
                    </div>
                    <div className="w-100 pointer d-flex justify-content-end">
                      <div
                        className="mb-2"
                        style={{
                          fontWeight: "8px",
                          color: "green",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                        onClick={() => setForgotPassword(!forgotPassword)}
                      >
                        forgot password?
                      </div>
                    </div>

                    <div className="input-group m-1">
                      <button
                        type="submit"
                        className="form-control btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "login"}
                      </button>
                    </div>
                    <div
                      className="signup-btn text-right "
                      onClick={toggleSignUp}
                    >
                      dont have an account?{" "}
                      <span
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        SignUp
                      </span>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h4 className="text-center">Sign-up</h4>
                  <form onSubmit={handleSignUp}>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        name="userId"
                        placeholder="enter your user id "
                        className="form-control"
                        onChange={handleSignUpFormChange}
                        value={SignUpFormValues.userId}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="username"
                        name="Username"
                        placeholder="enter your username"
                        className="form-control"
                        onChange={handleSignUpFormChange}
                        value={SignUpFormValues.Username}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <Form.Select
                        aria-label="user Type selection"
                        value={SignUpFormValues.userType}
                        name="userType"
                        onChange={handleSignUpFormChange}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ENGINEER">ENGINEER</option>
                        <option value="ADMIN">ADMIN</option>
                      </Form.Select>
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={SignUpFormValues.email}
                        onChange={handleSignUpFormChange}
                        placeholder="enter your email"
                      />
                    </div>
                    <div className="input-group m-1 d-flex justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        value={SignUpFormValues.password}
                        placeholder="enter your password"
                        onChange={handleSignUpFormChange}
                        required
                      />
                      <div
                        className="icon"
                        style={{
                          position: "absolute",
                          right: "8px",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          zIndex: "100",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VscEyeClosed /> : <VscEye />}
                      </div>
                    </div>
                    <div className="input-group m-2 width-100px">
                      <button
                        type="submit"
                        className="form-control btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Sign up"}
                      </button>
                    </div>

                    <div
                      className="signup-btn text-right "
                      onClick={toggleSignUp}
                    >
                      Already have an account?
                      <span
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Login
                      </span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
