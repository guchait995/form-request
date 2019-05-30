import React, { useEffect, useState } from "react";
import { getFirestore } from "../Dao/FirebaseDao";
import Department from "../Models/Department";

import User from "../Models/User";
import EachUserRow from "./EachUserRow";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";

export default function() {
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  var mydepartments: Department[] = [];
  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      getFirestore()
        .collection("users")
        .orderBy("department", "asc")

        .onSnapshot(snapShot => {
          var users: User[] = [];
          snapShot.forEach(qSnapshot => {
            var emaiId = qSnapshot.id;
            var data = qSnapshot.data();
            users.push({ email: emaiId, department: data.department });
          });
          setUserList(users);
        });
    }
  }, []);

  return (
    <div className="table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DEPARTMENT</TableCell>
            <TableCell>USER</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList
            ? userList.map((user, index) => {
                return <EachUserRow user={user} key={index} />;
              })
            : ""}
        </TableBody>
      </Table>
    </div>
  );
}
