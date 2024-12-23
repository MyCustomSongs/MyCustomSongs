import axios from "axios";
import { useEffect } from "react";

const Home = () => {

    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    }

    useEffect(() => {
        (async () => {
            await axios.get("https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n", {
                headers: headers,
              }).then((response) => {
                console.log("songslist", response.data);
              });
          })();
    },[]);

    return (
        <>
        <table className="table table-striped">
      <thead>
      <tr>
      <th>Album Name</th>
                  <th>Artist Name</th>
                  <th>Bitrate Fetched</th>
                  <th>Duration of song</th>
                  <th>Song Language</th>
                  <th>Release Date</th>
                  <th>Album Art Link (Max Resolution)</th>
                  <th>Song Title</th>
                  <th>Playable m3u8 Link</th>
                  <th>Lyrics</th>
                </tr>
      </thead>
      <tbody>
       
      </tbody>
    </table>
        </>
    );

}

export default Home;