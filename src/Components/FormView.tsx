import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { getFirestore, raisedRequest } from "../Dao/FirebaseDao";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Button
} from "@material-ui/core";
import Department from "../Models/Department";
import User from "../Models/User";
import Request from "../Models/Request";
import { REQUEST_PENDING } from "../AppConstants";
import LoginContext from "../Context/LoginContext";
import { openSnackbar } from "./CustomSnackbar";
export default function FormView() {
  const [departmentList, setDepartmentList] = useState<Department[]>();
  const [department, setDepartment] = useState<Department>();
  const [userList, setUserList] = useState<User[]>();
  const [user, setUser] = useState<User>();
  const {
    state: { loginInfo }
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
          if (departments) setDepartmentList(departments);
        },
        err => {}
      );
  }, []);
  useEffect(() => {
    if (department)
      getFirestore()
        .collection("departments")
        .doc(department.name)
        .collection("users")
        .onSnapshot(
          collectionSnapshot => {
            var users: User[] = [];
            collectionSnapshot.docs.forEach(doc => {
              var email = doc.data().email;
              var dept = doc.data().department;

              if (email && dept) users.push({ email: email, department: dept });
            });
            if (users) setUserList(users);
          },
          err => {}
        );
  }, [department]);
  const handleRequest = () => {
    if (user && department && loginInfo && loginInfo.user) {
      var dateObj: Date = new Date();
      var request: Request = {
        status: REQUEST_PENDING,
        department: department.name,
        toEmail: user.email,
        fromEmail: loginInfo.user.email,
        time: dateObj.getTime()
      };
      raisedRequest(request);
    }
  };
  return (
    <div>
      <div className="centre-box">
        <div className="box-heading">Raise A Request</div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleRequest();
          }}
        >
          <FormControl variant="outlined" margin="normal" fullWidth>
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
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">Users</InputLabel>
            <Select
              native
              value={user ? user.email : ""}
              onChange={e => {
                var userEmail: any = e.currentTarget.value;
                if (userEmail) {
                  setUser({ email: userEmail });
                }
              }}
              input={
                <OutlinedInput
                  name="user"
                  labelWidth={50}
                  id="outlined-age-native-simple"
                />
              }
            >
              <option value="" />

              {userList
                ? userList.map((user, key) => {
                    return (
                      <option value={user.email} key={key}>
                        {user.email}
                      </option>
                    );
                  })
                : null}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit">
            Request
          </Button>
        </form>
      </div>
    </div>
  );
}
