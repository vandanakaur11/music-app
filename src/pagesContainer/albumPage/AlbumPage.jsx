import Hls from "hls.js";
import Head from "next/head";
import { useRouter } from "next/router";
import plyr from "plyr";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
// import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import style from "./../../../styles/global.module.scss";
import Card1 from "./../../components/card1/Card1";
import LyricsModal from "./../../components/lyricsModal/LyricsModal";
import MusicTracker from "./../../components/musicTrack/MusicTrack";
import {
  setAlbum,
  setFavouriteId,
  setSong,
  setSongs,
} from "./../../store/musicReducer";
import classes from "./AlbumPage.module.css";

const postSelector = (state) => state.music;

const AlbumPage = ({ songs, album }) => {
  // console.log("AlbumPage Component >>>>>>>>");

  const { song, language, user, favouriteId } = useSelector(
    postSelector,
    shallowEqual
  );

  // console.log("postSelector >>>>>>>>>", postSelector);

  const route = useRouter();
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState(0);
  const [songName, setSongName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [pic, setPic] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [singleSong, setSingleSong] = useState("");
  const [songArray, setSongArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [songPlay, setSongPlay] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const audioPlayer = useRef();

  // seperate each song file
  // console.log(pic)

  const songFileArray = songs.map((ele, ind) => {
    let fileName = process.env.media_url.concat(ele.Song_File);
    return {
      fileName,
      length: ele.Song_Length,
    };
  });

  const onEndSong = () => {
    let currentSongIndex;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      currentSongIndex = localStorage.getItem("currentSongIndex");
    }

    currentSongIndex++;

    if (currentSongIndex < songArray.length) {
      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.setItem("currentSongIndex", currentSongIndex);
      }

      setSingleSong(
        `${process.env.media_url}/${songArray[currentSongIndex].Song_File}`
      );
    } else {
      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.setItem("currentSongIndex", 0);
      }

      setSongName(songArray[0].Song_Name);
      setAlbumName(songArray[0].Album_Name);

      // console.log(
      //   "img",
      //   process.env.media_url.concat(songArray[0].Album_Image)
      // );

      setPic(process.env.media_url.concat(songArray[0].Album_Image));
      setSingleSong(`${process.env.media_url}/${songArray[0]?.Song_File}`);
    }
  };

  useEffect(() => {
    // console.log(`${process.env.media_url}/${songArray[0]?.Song_File}`)
    setSingleSong(`${process.env.media_url}/${songArray[0]?.Song_File}`);
    setSongPlay(true);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        // console.log("video and hls.js are now bound together !");
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        // console.log(
        //   "manifest loaded, found " + data.levels.length + " quality level"
        // );
      });
      hls.loadSource(singleSong);
      hls.attachMedia(document.querySelector("#audioPlayer"));
    }

    plyr.setup(document.querySelector("#audioPlayer"));
  }, [singleSong]);

  useEffect(() => {
    let currentSongIndex;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      currentSongIndex = localStorage.getItem("currentSongIndex");
    }

    setAlbumName(songArray[currentSongIndex]?.Album_Name);
    setSongName(songArray[currentSongIndex]?.Song_Name);
    setLyrics(songArray[currentSongIndex]?.Song_Lyrics);
    setPic(
      `${process.env.media_url}/`.concat(
        songArray[currentSongIndex]?.Album_Image
      )
    );
  }, [singleSong]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      localStorage.setItem("currentSongIndex", 0);
    }

    // console.log(`${process.env.media_url}/${songs[0].Song_File}`);
    // songs?.some((s) => {
    //     if (s?._id === favouriteId) {
    //         let calcSecs = calculateSeconds(s?.Song_Length)
    //         console.log(calcSecs)
    //         setCurrentTime(calcSecs)
    //     }
    // })
    // console.log(songs)

    let user;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      user = JSON.parse(localStorage.getItem("music-app-credentials"));
    }

    if (user?.hasOwnProperty("expiresIn")) {
      let tempArr = songs.filter((ele, i) => {
        if (i === 1) return ele;
        if (i !== 1 && i % 5 === 0) {
          return ele;
        }
      });

      let stringifyArray = JSON.stringify(tempArr);

      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.setItem("songArray", stringifyArray);
      }

      setSongArray(tempArr);
      setSingleSong(`${process.env.media_url}/${tempArr[0].Song_File}`);
    } else {
      let stringifyArray = JSON.stringify(songs);

      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.setItem("songArray", stringifyArray);
      }

      if (favouriteId) {
        let index = songs.findIndex((o) => o._id === favouriteId);
        let arr1 = songs.slice(index, songs.length);
        let arr2 = songs.slice(0, index);
        const finalArr = [...arr1, ...arr2];
        setSongArray(finalArr);
        setSingleSong(`${process.env.media_url}/${finalArr[0].Song_File}`);
      } else {
        setSongArray(songs);
        setSingleSong(`${process.env.media_url}/${songs[0]?.Song_File}`);
      }
    }

    setSongName(songs[0]?.Song_Name);
    setLyrics(songs[0]?.Song_Lyrics);

    if (!user?.token) return route.replace("/login");

    if (!songs?.length) return route.replace("/");

    // console.log("album page album >>>>>>>>>>>>>>", album);
    // console.log("album page songs >>>>>>>>>>>>>>", songs);

    dispatch(setSongs(songs));
    dispatch(setAlbum(album));

    if (isMobile) {
      dispatch(setSong(songs[songs.length - 1]));
    } else {
      // dispatch(setSong(songs[0]));
      dispatch(setSong(songs[songs.length - 1]));
    }

    return () => {
      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.removeItem("counter");
      }

      dispatch(setFavouriteId(""));
    };
  }, [album]);

  // useEffect(() => {
  //     songs?.filter((s) => {
  //         if (s?._id === favouriteId) {
  //             let calcSecs = calculateSeconds(s?.Song_Length)
  //             console.log(calcSecs)
  //             setCurrentTime(calcSecs)
  //         }
  //     })
  // }, [])

  // set song from playlist

  // useEffect(() => {
  // }, [])
  // console.log(currentTime)

  // function calculateSeconds(hms) {
  //     var a = hms.split(":");
  //     let seconds = a[0] * 60 + +a[1];
  //     if (a.length > 2) {
  //         seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  //     }
  //     return seconds;
  // }

  if (!songs || !songs.length) return <h1>Loading...</h1>;

  // console.log("single song", singleSong);

  // now you can bind 'curr_track.play()' to some click-event

  //testing mulder song

  return (
    <div className={classes.albums}>
      <Head>
        <title>
          {song?.Album_Name} | {song?.Song_Name}
        </title>
        <meta name="description" content={song?.Song_Name} />
      </Head>
      <br />
      <h4 style={{ color: "white", textAlign: "center" }}>STREAMING</h4>
      <h1>{song?.Album_Name}</h1>
      <LyricsModal
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        lyrics={lyrics}
      />
      <div className={classes.albumsMain}>
        <Card1
          title={song?.Album_Name}
          url={`${process.env.media_url}/${
            language.title === "eng"
              ? song?.Album_Image
              : song?.Album_Image.replace("eng", "nl")
          }`}
          disableFetch
        />
        <div className={classes.albumsMainPlaylist}>
          {songs?.map(
            (albumSong, i) =>
              songs?.length - 1 !== i && (
                <Fragment key={i}>
                  <MusicTracker
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    albumSong={albumSong}
                    order={i}
                    songs={songs}
                    setSongName={setSongName}
                    trial={user?.hasOwnProperty("expiresIn")}
                    setSongArray={setSongArray}
                    setSingleSong={setSingleSong}
                  />
                  {/* <div className={classes.lyricsStyle}>Lyrics</div> */}
                </Fragment>
              )
          )}
        </div>
      </div>

      <div className={style.music}>
        <div className={classes.hoverStyling}>
          <img src={pic}></img>
        </div>
        <div className={style.infoDiv}>
          <p className={style.Album_Name}>{albumName}</p>
          {/* <br></br> */}
          <p className={style.Song_Name}>{songName}</p>
          {lyrics !== "" && (
            <p
              style={{
                fontSize: "12px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              className={style.show_lyrics}
              onClick={() => setOpen(true)}
            >
              Show Lyrics
            </p>
          )}
        </div>
        <div className={style.trash}></div>
        <div className={style.trash}></div>
        <div className={style.trash}></div>
        <div className={style.trash}></div>
        <div className={style.trash}></div>
        <audio
          preload="true"
          id="audioPlayer"
          ref={audioPlayer}
          controls
          crossOrigin="true"
          src={singleSong}
          className={classes.audioPlayer}
          autoPlay={songPlay}
        ></audio>
        {/* <AudioPlayer
          preload="true"
          id="audioPlayer"
          className={style.player}
          progressJumpStep={3000}
          src={singleSong}
          // src="https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads1/audio/8+-+Christmas/09+The+Son+of+Mary/09+The+Son+of+Mary.m3u8"
          onEnded={(e) => onEndSong(e)}
        /> */}
      </div>

      {/* <MusicPlayer currentTime={currentTime} setCurrentTime={setCurrentTime} songs={songs} trial={user?.hasOwnProperty("expiresIn")} songName={songName} setSongName={setSongName} setLyrics={setLyrics} lyrics={lyrics} /> */}
    </div>
  );
};
// Nothing

export default React.memo(AlbumPage);
