import React, { useEffect, useState } from "react";
import { submitLoginForm } from "../../Providers/main";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setInactivityTimeout, setToDoCount, setFlaggedPageCount } from "../../Redux/general/actions";
import axios from "axios";
import { getToken } from "../../Utils/helper";
import { func } from "prop-types";
import { fetchAllPages_New } from "../../Redux/pages/pagesSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loginLoader, setLoginLoader] = useState(false)
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [usernameReset, setUsernameReset] = useState("");
  const [errorMsgSendOtp, setErrorMsgSendOtp] = useState("");
  const [errorMsgVerifyOtp, setErrorMsgVerifyOtp] = useState("");
  const [errorMsgResetPass, setErrorMsgResetPass] = useState("");
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  useEffect(()=>{
    dispatch(fetchAllPages_New(`${origin}/api/litigation-page/get-pages/`))
  }, [])

   

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoginLoader(true)
    await submitLoginForm(
      username,
      password,
      setErrorMsg,
      setLoginLoader,
      setInactivityTimeout,
      setToDoCount,
      setFlaggedPageCount,
      dispatch,
      navigate
    )
  }

  // Set the origin URL

console.log("origin = ", process.env.REACT_APP_BACKEND_URL);

const api = axios.create({
  baseURL: origin,
  headers: {
    "Content-Type": "application/json",
  },
});

// A map to store pending requests and their cancel tokens
const pendingRequests = new Map();

// Function to generate a unique request key based on config
const getRequestKey = (config) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add Authorization header if a token is available
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }

    // Generate a unique key for the request
    const requestKey = getRequestKey(config);

    // Check if the request is already pending
    if (pendingRequests.has(requestKey)) {
      // Cancel the duplicate request
      return Promise.reject(new axios.Cancel("Duplicate request canceled"));
    }

    // Create a new cancel token and add it to the pending requests map
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    pendingRequests.set(requestKey, cancelTokenSource);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Remove the request from pendingRequests after receiving the response
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    // If the request was canceled, log it and avoid rejecting the promise
    if (axios.isCancel(error)) {
      console.log(error.message);
    } else {
      // Remove the request from pendingRequests on other errors
      const requestKey = getRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    return Promise.reject(error);
  }
);



  // Handle send OTP form
  function handleForgetPassword(e) {
    e.preventDefault();
    // Logic for sending OTP
    setUsernameReset("")
    setErrorMsgSendOtp("")
    setStep(2)
  }

   // Handle send OTP form
   function handleSendOTP(e) {
    e.preventDefault();
    setErrorMsgVerifyOtp("")
    setOtp("")
    const requestData = {
      username: usernameReset // Assuming `username` is a state variable that holds the value entered by the user
    };
    return new Promise((resolve, reject) => {
      api
        .post(`/api/forget-password-api/`,requestData)
        .then((response) => {
          if (response.data.result === "success") {
            setUserId(response.data.user_id)
            setStep(3)
          }
          else{
            setErrorMsgSendOtp(response.data.error_message)
          }
          return;
        })
        .catch((err) => {
          console.log("Error occurred while fetching client-provider", err);
          reject(err);
          return;
        });
    });
  }
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Handle verify OTP form
async function handleVerifyOTP(e) {
  e.preventDefault();
  setNewPassword("")
  setConfirmPassword("")
  setErrorMsgResetPass("")
  const requestData = {
    entered_otp: otp,
    user_id: userId
  };

  try {
    const response = await api.post(`/api/verify-otp-api/`, requestData);

    if (response.data.result === "success") {
      setOtpToken(response.data.token);
      setStep(4);
    } else {
      setErrorMsgVerifyOtp(response.data.error_message);
      if (response.data.error_code == 403) {
        await delay(3000); // Wait for 3 seconds
        handleForgetPassword(e)
      }
    }
  } catch (err) {
    console.log("Error occurred while fetching client-provider", err);
    // Handle the error as needed
  }
}


  // Handle reset password form
  function handleResetPassword(e) {
    e.preventDefault();
    
    if(!newPassword){
      setErrorMsgResetPass("Password is empty")
      return
    }
    if(newPassword != confirmPassword){
      setErrorMsgResetPass("Passwords do not match")
      return
    }
    setErrorMsg("")
    const requestData = {
      new_password: newPassword,
      token:otpToken
    };
    return new Promise((resolve, reject) => {
      api
        .post(`/api/reset-password-api/`,requestData)
        .then((response) => {
          if (response.data.result === "success") {
            setStep(1)
          }
          else{
            setErrorMsgResetPass(response.data.error_message)
          }
        })
        .catch((err) => {
          console.log("Error occurred while fetching client-provider", err);
          reject(err);
        });
    });
    // Logic for resetting password
    // navigate("/login"); // After resetting password, navigate to login or any other desired page
  }

  function handleRedirectLogin(e) {
    e.preventDefault();
    setStep(1); 
  }

  


  return (
    <div className="login-page">
      <div className="page-wrapper">
        <div className="page-container">
          <div className="main-content">
            <div
              className="section__content section__content--p30 login-form"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12 top-head">
                    {/* Step 1: Login Form */}
                    {step === 1 && (
                    <form method="POST" onSubmit={handleLoginSubmit}>
                      <div className="container">
                        <span className="username-set">
                          <i className="fa fa-user" aria-hidden="true"></i>
                          <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            name="username"
                            id="username"
                            required
                          />
                        </span>
                        <br />
                        <span className="username-set">
                          <i className="fa fa-lock" aria-hidden="true"></i>
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            name="password"
                            id="password"
                            required
                          />
                        </span>
                        <button
                          className={
                            "cancelbtn " +
                            (loginLoader ? "button-disabled" : "")
                          }
                          type="submit"
                        >
                          <div className="button-content d-flex justify-content-between">
                            {loginLoader && (
                              <div className="loader-small mr-2"></div>
                            )}
                            <span>Login</span>
                          </div>
                        </button>
                        <div className="d-flex login-page-justify-content-center">
                          <p>
                            <a href="#" onClick={handleForgetPassword}>
                              Forget Password?
                            </a>
                          </p>
                          <p className="pl-5"> 
                            <a href="{% url 'bp-register' %}">
                              Request An Account
                            </a>
                          </p>
                          <p className="pl-5">
                            <a href="{% url 'bp-clientLogin' %}">
                              Client Portal
                            </a>
                          </p>
                        </div>
                        <p style={{ color: "red" }}>{errorMsg}</p>
                      </div>
                    </form>
                    )}
                    {/* Step 2: Send OTP Form */}
                    {step === 2 && (
                          <form onSubmit={handleSendOTP}>
                          <div className="container">
                          {errorMsgSendOtp && (
                              <div className="alert alert-danger" role="alert">
                                {errorMsgSendOtp}
                              </div>
                            )}
                            <span className="username-set">
                              <i className="fa fa-user" aria-hidden="true"></i>
                              <input
                                value={usernameReset}
                                onChange={(e) => setUsernameReset(e.target.value)}
                                type="text"
                                placeholder="Username"
                                name="username"
                                id="username"
                                required
                              />
                            </span>
                            <button className="cancelbtn" type="submit">
                              Send OTP
                            </button>
                            <div className="d-flex login-page-justify-content-center">
                              <p>
                                <a href="#" onClick={handleRedirectLogin}>
                                  Back to Login
                                </a>
                              </p>
                            </div>
                            
                          </div>
                        </form>
                    )}
                     {/* Step 3: Verify OTP Form */}
                     {step === 3 && (
                          <form onSubmit={handleVerifyOTP}>
                          <div className="container">
                            {errorMsgVerifyOtp && (
                              <div className="alert alert-danger" role="alert">
                                {errorMsgVerifyOtp}
                              </div>
                            )}
                            <span className="username-set">
                              <i className="fa fa-key" aria-hidden="true"></i>
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                name="otp"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                              />
                            </span>
                            <button className="cancelbtn" type="submit">
                              Verify OTP
                            </button>
                            <div className="d-flex login-page-justify-content-center">
                              <p>
                                <a href="#" onClick={handleRedirectLogin}>
                                  Back to Login
                                </a>
                              </p>
                            </div>
                            
                          </div>
                          </form>
                     )}
                        {/* Step 4: Reset Password Form */}
                    {step === 4 && (
                      <form onSubmit={handleResetPassword}>
                      <div className="container">
                        {errorMsgResetPass && (
                          <div className="alert alert-danger" role="alert">
                            {errorMsgResetPass}
                          </div>
                        )}
                        <span className="username-set">
                          <i className="fa fa-lock" aria-hidden="true"></i>
                          <input
                            type="password"
                            placeholder="New Password"
                            name="new_password"
                            id="new_password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </span>
                        <span className="username-set">
                          <i className="fa fa-lock" aria-hidden="true"></i>
                          <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirm_password"
                            id="confirm_password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </span>
                        <button className="cancelbtn" type="submit">
                          Reset Password
                        </button>
                      </div>
                    </form>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
