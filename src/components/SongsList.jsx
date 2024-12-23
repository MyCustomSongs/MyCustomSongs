import { useEffect } from "react";
import axios from "axios";
import Home from "./Home";

const SongsList = () => {
let title = "Available Songs List";
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
const uData = {
    "grant_type": "client_credentials",
    "client_id": "353ad11031ad4bd48ad64bb32e697670",
    "client_secret": "02c75dc11e6d4e7faa19e58384394c97"
    };
useEffect(()=> {
    (async () => {
        await axios.post("https://accounts.spotify.com/api/token", uData, {
            headers: headers
          }).then((response) => {
            sessionStorage.setItem("token", response.data.access_token);
          });
      })();
},[]);

return (
    <>
    <h2>{title}</h2>
    <Home/>
    </>
);

}

export default SongsList;