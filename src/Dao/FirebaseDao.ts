import * as firebase from "firebase";
import Request from "../Models/Request";
import {
  REQUEST_APPROVED,
  REQUEST_PENDING,
  SNACKBAR_TIMEOUT,
  PENDING_REQUEST_ADDED_MESSAGE,
  REQUEST_APPROVED_MESSAGE,
  REQUEST_REJECTED,
  REQUEST_REJECTED_MESSAGE
} from "../AppConstants";
import { openSnackbar } from "../Components/CustomSnackbar";
var firebaseConfig = {
  apiKey: "AIzaSyBzJ2wwNvohHWXxM1kO3Rfw4r_jownScdU",
  authDomain: "logintest-1533258605100.firebaseapp.com",
  databaseURL: "https://logintest-1533258605100.firebaseio.com",
  projectId: "logintest-1533258605100",
  storageBucket: "logintest-1533258605100.appspot.com",
  messagingSenderId: "136284331673",
  appId: "1:136284331673:web:5580fee6dd7ca2cb"
};
firebase.initializeApp(firebaseConfig);
export function getFirestore() {
  return firebase.firestore();
}
export function getAuth() {
  return firebase.auth();
}

export function raisedRequest(request: Request) {
  if (request && request.time) {
    //Add to pending Request
    getFirestore()
      .collection("requests")
      .doc(request.time.toString())
      .set(request)
      .then(res => {
        openSnackbar({
          message: PENDING_REQUEST_ADDED_MESSAGE,
          timeout: SNACKBAR_TIMEOUT
        });
        // console.log("pending request succesffuly added");
      })
      .catch(err => {
        console.error(err);
      });
  }
}
export function approveRequest(request: Request) {
  var editedRequest: Request = { ...request, status: REQUEST_APPROVED };
  if (request && request.time)
    getFirestore()
      .collection("requests")
      .doc(request.time.toString())
      .set(editedRequest)
      .then(res => {
        openSnackbar({
          message: REQUEST_APPROVED_MESSAGE,
          timeout: SNACKBAR_TIMEOUT
        });
      })
      .catch(err => {
        console.error(err);
      });
}
export function rejectRequest(request: Request) {
  var editedRequest: Request = { ...request, status: REQUEST_REJECTED };
  if (request && request.time)
    getFirestore()
      .collection("requests")
      .doc(request.time.toString())
      .set(editedRequest)
      .then(res => {
        openSnackbar({
          message: REQUEST_REJECTED_MESSAGE,
          timeout: SNACKBAR_TIMEOUT
        });
      })
      .catch(err => {
        console.error(err);
      });
}
