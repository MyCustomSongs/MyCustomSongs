import * as XLSX from "xlsx";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

// FileName: App.js
import Player from "./components/PlayerSong";
import Song from "./components/Song";
import "./styles/app.scss";
import { v4 as uuidv4 } from "uuid";
// Importing DATA
import {defaultSongs} from "./data";
import Library from "./components/Library";
import Nav from "./components/Navb";
function App() {
  const [songs, setSongs] = useState(defaultSongs);
  const [currentSong, setCurrentSong] = useState(songs?.[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const audioRef = useRef(null);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  ////////// songs list
  const fileName = "/MyCustomSongs/linksData/AudioSongsList.xlsx"; // for gh pages path
 // const fileName = "/linksData/AudioSongsList.xlsx"; // for local use path path
   
    useEffect(() => {
      (async function () {
        try {
          const response = await axios.get(fileName, { responseType: 'arraybuffer' });
          const data1 = new Uint8Array(response.data);
          const wb = XLSX.read(data1, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          
          let songsList = excelData?.filter(d => d[3] === 'audio/mpeg')?.map((x) => {
          //  if(x[3] == 'audio/mpeg'){
            return {
              name: x[0],
              cover:"/images/SongCoverPic.jpg",
              artist: x[4],
              audio: `https://drive.google.com/file/d/${x[2]}/preview`,
              color: ["#205950", "#2ab3bf"],
              id: uuidv4(),
              active: true,
            };
          //}
          });
          setSongs(songsList);
          console.log(songsList);
        } catch (e) {
          console.error(e);
        }
      })();
    }, [fileName]);
  
  //////////

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //calculating percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    console.log();
    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);

    if (isPlaying) audioRef.current.play();
  };
  return (
    <div>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        id={songs?.id}
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
      />
        <iframe
        title="iframe_song"
        frameborder="0"
        width="420"
        height="220"
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        ref={audioRef}
        onEnded={songEndHandler}
        src={currentSong.audio}>
      </iframe> 
      {<audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
       // src={currentSong.audio}
        ref={audioRef}
        onEnded={songEndHandler}
      ></audio> }
    </div>
  );
}

export default App;
