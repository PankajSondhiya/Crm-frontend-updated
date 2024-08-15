import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFirebase } from "../firebase/firebase.config";
import { AxiosInstance } from "../AxiosInstance/AxiosInstance";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";

const Passwordreset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { changePassword } = useFirebase();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("oobCode");
    if (code) {
      setOobCode(code);
    }
  }, [location]);

  async function handleChangePassword(newPassword) {
    try {
      await changePassword(oobCode, newPassword);
      await AxiosInstance.put("/crm/api/v1/auth/resetpassword", {
        email: localStorage.getItem("verfication_email"),
        newPassword,
      });
      toast.success("password reset successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <>
      <div className="vh-100 bg-primary d-flex justify-content-center align-items-center">
        <div className="card p-3  d-flex  flex-column justify-content-center align-items-center">
          <h4> Reset password</h4>
          <div className="input-group m-2 d-flex justify-content-center align-items-center">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control"
              required
              autoComplete="off"
              onChange={(event) => setNewPassword(event.target.value)}
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
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <VscEyeClosed /> : <VscEye />}
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => handleChangePassword(newPassword)}
          >
            change password
          </button>
        </div>
      </div>
    </>
  );
};

export default Passwordreset;
