import React, { useState, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { NavLink, Redirect } from "react-router-dom";

import {
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
  Button,
  InputLabel,
  Select,
  OutlinedInput
} from "@material-ui/core";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LoginContext from "../Context/LoginContext";
import { getFirestore } from "../Dao/FirebaseDao";
import Department from "../Models/Department";

function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [department, setDepartment] = useState<Department>();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(
    false
  );
  const {
    state: { loginInfo },
    actions: { signUpWithEmailAndPassword, setLoginDetails }
  } = useContext<any>(LoginContext);
  useEffect(() => {
    getFirestore()
      .collection("departments")
      .onSnapshot(
        collectionSnapshot => {
          var departments: Department[] = [];

          collectionSnapshot.docs.forEach(doc => {
            departments.push({ name: doc.id });
          });
          console.log(departments);
          if (departments) setDepartmentList(departments);
        },
        err => {}
      );
  }, []);
  useEffect(() => {
    console.log(department);
  }, [department]);
  const handleSignUp = () => {
    signUpWithEmailAndPassword(email, password, department);
  };
  return (
    <div className="centre-box">
      <div className="box-heading">SIGN UP</div>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <FormControl fullWidth>
          <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            onChange={value => {
              setEmail(value.currentTarget.value);
            }}
          />
          <FormControl variant="outlined" margin="normal">
            <InputLabel htmlFor="outlined-age-native-simple">
              Department
            </InputLabel>
            <Select
              native
              value={department ? department.name : ""}
              onChange={e => {
                var dept: any = e.currentTarget.value;
                if (dept) {
                  setDepartment({ name: dept, users: null });
                }
              }}
              input={
                <OutlinedInput
                  name="department"
                  labelWidth={100}
                  id="outlined-age-native-simple"
                />
              }
            >
              <option value="" />

              {departmentList
                ? departmentList.map((department, key) => {
                    return (
                      <option value={department.name} key={key}>
                        {department.name}
                      </option>
                    );
                  })
                : null}
            </Select>
          </FormControl>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            onChange={value => {
              setPassword(value.currentTarget.value);
            }}
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            margin="normal"
            onChange={value => {
              setConfirmPassword(value.currentTarget.value);
            }}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showConfirmPassword);
                    }}
                  >
                    {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => {
              // handleSignUp();
              return <Redirect to="/" />;
            }}
          >
            SIGNUP
          </Button>
        </FormControl>
      </form>
      <NavLink to="/">LOGIN</NavLink>
    </div>
  );
}
export default withRouter(Signup);
// const SpecialButton = withRouter(({ history, path, text,email,password,department }) => {
//   const {
//     actions: { signUpWithEmailAndPassword }
//   } = useContext<any>(LoginContext);
//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       onClick={() => { signUpWithEmailAndPassword(email,password,department,history) }}
//     >
//       {text}
//     </Button>
//   )
// });
