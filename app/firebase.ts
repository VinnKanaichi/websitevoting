// app/firebase.ts
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCxVtHwQlcmx_85nOz7nnqTlGOW_Hq1WF0",
  authDomain: "database-vot.firebaseapp.com",
  databaseURL: "https://database-vot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-vot",
  storageBucket: "database-vot.appspot.com",
  messagingSenderId: "455148726681",
  appId: "1:455148726681:web:89e91e7e2378bb836b4b08",
  measurementId: "G-Q53094PMYL"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
