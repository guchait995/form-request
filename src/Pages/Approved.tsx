import React, { useEffect, useState } from "react";
import MainBody from "../Components/MainBody";
import { getFirestore } from "../Dao/FirebaseDao";

import Request from "../Models/Request";
import RequestView from "../Components/RequestView";
import { REQUEST_PENDING, REQUEST_APPROVED } from "../AppConstants";
export default function Approved() {
  const [approvedRequestList, setApprovedRequestList] = useState<Request[]>([]);

  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      getFirestore()
        .collection("requests")
        .where("status", "==", REQUEST_APPROVED)
        .onSnapshot(collectionSnapshot => {
          if (collectionSnapshot) {
            var requests: Request[] = [];
            collectionSnapshot.forEach(QuerySnapshot => {
              if (QuerySnapshot) {
                var data = QuerySnapshot.data();
                var key = QuerySnapshot.id;
                if (data && key) {
                  requests.push(data);
                }
              }
            });
            setApprovedRequestList(requests);
          }
        });
    }
  }, []);
  return (
    <MainBody>
      <div className="centre-box">
        <div className="box-heading">APPROVED REQUEST</div>
        <div className="request-list">
          {approvedRequestList
            ? approvedRequestList.map((request, key) => {
                return (
                  <RequestView
                    viewModel={REQUEST_PENDING}
                    request={request}
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
