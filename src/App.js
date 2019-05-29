import React, { useContext, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  HashRouter,
  Switch
} from "react-router-dom";
import "./Stylesheet/styles.css";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import LoginContext from "./Context/LoginContext";
import { Redirect } from "react-router-dom";
import LoginProvider from "./Context/LoginProvider";
import Approval from "./Pages/RequestApproval";
import RequestApproval from "./Pages/RequestApproval";
import Pending from "./Pages/Pending";
import Approved from "./Pages/Approved";
import Signup from "./Pages/Signup";
import { getAuth } from "./Dao/FirebaseDao";
import CustomSnackbar from "./Components/CustomSnackbar";
import CustomBootDialog from "./Components/CustomBootDialog";

export default function App() {
  return (
    <LoginProvider>
      <CustomSnackbar />
      <CustomBootDialog />
      <Router>
        <Switch>
          <Route exact path="/" component={LoginWrapper} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/Home" component={Home} />
          <PrivateRoute
            path="/RequestForApproval"
            component={RequestApproval}
          />
          <PrivateRoute path="/Pending" component={Pending} />
          <PrivateRoute path="/Approved" component={Approved} />
        </Switch>
      </Router>
    </LoginProvider>
  );
}

function LoginWrapper(props) {
  const {
    state: { loginInfo },
    actions: { loginWithEmailAndPassword, setLoginDetails }
  } = useContext(LoginContext);
  useEffect(() => {
    var isMounted = false;
    if (!isMounted) {
      isMounted = true;
      getAuth().onAuthStateChanged(firebaseUser => {
        console.log("auth changed");
        if (firebaseUser) {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: true,
            user: firebaseUser,
            userDetails: { email: firebaseUser.email }
          });
        } else {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: false,
            user: null,
            userDetails: null
          });
        }
      });
    }
  }, []);
  if (loginInfo && loginInfo.isLoggedIn && loginInfo.user) {
    return <Home />;
  }
  return <Login {...props} />;
}

function PrivateRoute({ component: Component, ...rest }) {
  const {
    state: { loginInfo },
    actions: { loginWithEmailAndPassword, setLoginDetails }
  } = useContext(LoginContext);
  useEffect(() => {
    var isMounted = false;
    if (!isMounted) {
      isMounted = true;
      getAuth().onAuthStateChanged(firebaseUser => {
        console.log("auth changed");
        if (firebaseUser) {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: true,
            user: firebaseUser,
            userDetails: { email: firebaseUser.email }
          });
        } else {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: false,
            user: null,
            userDetails: null
          });
        }
      });
    }
  }, []);
  return (
    <Route
      {...rest}
      render={props => {
        if (loginInfo && loginInfo.isLoggedIn && loginInfo.user) {
          return <Component {...props} />;
        }

        return <Login {...props} />;
      }}
    />
  );
}
