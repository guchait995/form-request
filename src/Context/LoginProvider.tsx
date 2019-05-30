import React, { useState, useEffect } from "react";
import LoginContext from "./LoginContext";
import { getAuth, getFirestore } from "../Dao/FirebaseDao";
import { Redirect, Route } from "react-router-dom";
import Login from "../Pages/Login";
import { openSnackbar } from "../Components/CustomSnackbar";
import {
  LOGIN_EMAIL_NOT_FOUND,
  SNACKBAR_TIMEOUT,
  LOGIN_FAILED_MESSAGE,
  SIGNUP_EMAIL_ALREADY_FOUND
} from "../AppConstants";

export interface LoginInfo {
  user: any;
  isLoggedIn: boolean | null;
  userConfigFetched: boolean | null;
}

export default function LoginProvider(props) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    user: null,
    isLoggedIn: null,
    userConfigFetched: null
  });
  const loginWithEmailAndPassword = async (email, password) => {
    getAuth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log("Successfully Logged In");
      })
      .catch(err => {
        console.error(err);
        if (err.code === "auth/user-not-found")
          openSnackbar({
            message: LOGIN_EMAIL_NOT_FOUND,
            timeout: SNACKBAR_TIMEOUT
          });
        else
          openSnackbar({
            message: LOGIN_FAILED_MESSAGE,
            timeout: SNACKBAR_TIMEOUT
          });
      });
  };

  const signUpWithEmailAndPassword = async (email, password, department) => {
    // console.log("signup called");
    getAuth()
      .createUserWithEmailAndPassword(email, password)
      .then(firebaseUser => {
        if (firebaseUser && firebaseUser.user) {
          console.log(firebaseUser.user);
          getFirestore()
            .collection("departments")
            .doc(department.name)
            .collection("users")
            .doc(firebaseUser.user.uid)
            .set({ department: department.name, email: email })
            .then(res => {
              console.log("user details saved");
              // window.open("/")
            });
        }
      })
      .catch(err => {
        console.error(err);
        if (err.code == "auth/email-already-in-use") {
          openSnackbar({
            message: SIGNUP_EMAIL_ALREADY_FOUND,
            timeout: SNACKBAR_TIMEOUT
          });
        }
      });
  };
  const signOut = async () => {
    getAuth()
      .signOut()
      .then(res => {
        console.log("successfully signed out");
      })
      .catch(err => {
        console.error(err);
      });
  };
  const setLoginDetails = loginDetails => {
    setLoginInfo(loginDetails);
  };
  return (
    <LoginContext.Provider
      value={{
        state: { loginInfo },
        actions: {
          loginWithEmailAndPassword,
          signUpWithEmailAndPassword,
          setLoginDetails,
          signOut
        }
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}
