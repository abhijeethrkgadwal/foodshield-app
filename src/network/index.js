import axios from "axios";

const network = axios.create({
    baseURL: "",
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


export default network;