import React from "react";
import Header from "../Components/Header";
import FormView from "../Components/FormView";
import MainBody from "../Components/MainBody";
import DepartmentUserList from "../Components/DepartmentUserList";

export default function Home() {
  return (
    <MainBody>
      <FormView />
      <DepartmentUserList />
    </MainBody>
  );
}
