import UserLayout from "@/layout/UserLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (!userLoginMethod && authState.message?.message === "Registration is successfull, Please login") {
      router.push("/login");
    }
  }, [authState.message, userLoginMethod]);

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  },[])

  useEffect(()=>{
    dispatch(emptyMessage())
  }, [userLoginMethod])


  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () =>{
    dispatch(loginUser({email, password}))
  }

  const heading = userLoginMethod ? "Login" : "Sign Up";

  return (
    <UserLayout>
      <Head>
        <title>{`${heading} · ProLink`}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className="eyebrow">{userLoginMethod ? "Welcome back" : "Join ProLink"}</p>
            <h1 key={heading} className={`display ${styles.cardleft_heading}`}>{heading}</h1>

            <form
              className={styles.inputContainer}
              onSubmit={(e) => {
                e.preventDefault();
                if (userLoginMethod) {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }}
            >
              {!userLoginMethod && <div className={styles.inputRow}>
                <label className={styles.label}>
                  <span>Username</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="field"
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                  />
                </label>
                <label className={styles.label}>
                  <span>Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field"
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                  />
                </label>
              </div>}
              <label className={styles.label}>
                <span>Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                />
              </label>
              <label className={styles.label}>
                <span>Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field"
                  type="password"
                  placeholder="Password"
                  autoComplete={userLoginMethod ? "current-password" : "new-password"}
                />
              </label>

              {authState.message?.message && (
                <p
                  className={`${styles.message} ${authState.isError ? styles.messageError : styles.messageOk}`}
                  role={authState.isError ? "alert" : "status"}
                >
                  {authState.message.message}
                </p>
              )}

              <button type="submit" className={`btn btn-accent ${styles.submit}`} disabled={authState.isLoading}>
                {authState.isLoading ? "Please wait…" : heading}
              </button>
            </form>

            <p className={styles.switchMobile}>
              {userLoginMethod ? "Don't have an account ?" : "Already have an account ?"}{" "}
              <button type="button" onClick={() => setUserLoginMethod(!userLoginMethod)}>
                {userLoginMethod ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

          <div className={styles.cardContainer_right}>
            <div className={styles.rightInner}>
              <p className={`display ${styles.quote}`}>
                Connect with Friends <em>without Exaggeration</em>
              </p>
              <div className={styles.switch}>
                {userLoginMethod ? <p>Don't have an account ?</p>: <p>Already have an account ?</p>}
                <button type="button" onClick={()=>{
                  setUserLoginMethod(!userLoginMethod)
                }} className={styles.signinBtn}>
                  {userLoginMethod ? "Sign Up":"Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
