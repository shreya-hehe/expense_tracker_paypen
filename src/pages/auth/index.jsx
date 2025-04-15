import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker");
  };

  if (isAuth) {
    return <Navigate to="/expense-tracker" />;
  }

  return (
    <div className="login-page">
     <div className="login-box">
     {/* <img src="https://i.pinimg.com/736x/83/b8/73/83b873e09c787b78d5c68dad5ae64fcf.jpg" alt="Login Illustration" class="login-img" /> */}
      <p>Welcome to Paypen!</p>
      <p>Sign In With Google to Continue</p>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        {" "}
        Sign In With Google
      </button>
      </div>
    </div>
  );
};
