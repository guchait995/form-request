import React, { useEffect, useState, useContext } from "react";
import MainBody from "../Components/MainBody";
import { getFirestore } from "../Dao/FirebaseDao";
import Request from "../Models/Request";
import RequestView from "../Components/RequestView";
import LoginContext from "../Context/LoginContext";
import { REQUEST_RAISE_FOR_APPROVAL, REQUEST_PENDING } from "../AppConstants";

export default function RequestApproval() {
  const [approvalRequestList, setApprovalRequestList] = useState<Request[]>([]);
  const {
    state: { loginInfo }
  } = useContext<any>(LoginContext);
  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      getFirestore()
        .collection("requests")
        .where("status", "==", REQUEST_PENDING)
        .onSnapshot(collectionSnapshot => {
          if (collectionSnapshot) {
            var requests: Request[] = [];
            var idList: string[] = [];
            collectionSnapshot.forEach(QuerySnapshot => {
              if (QuerySnapshot) {
                var data = QuerySnapshot.data();
                var id = QuerySnapshot.id;
                if (data && id) {
                  if (loginInfo.user) {
                    var ownerEmail = loginInfo.user.email;
                    if (ownerEmail && data.toEmail === ownerEmail)
                      requests.push(data);
                  }
                }
              }
            });
            setApprovalRequestList(requests);
          }
        });
    }
  }, []);
  return (
    <MainBody>
      <div className="centre-box">
        <div className="box-heading">REQUEST FOR APPROVAL</div>
        <div className="request-list">
          {approvalRequestList
            ? approvalRequestList.map((request, key) => {
                return (
                  <RequestView
                    request={request}
                    viewModel={REQUEST_RAISE_FOR_APPROVAL}
                    key={key}
                  />
                );
              })
            : null}
        </div>
      </div>
    </MainBody>
  );
}
