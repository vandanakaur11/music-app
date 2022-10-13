import { IconButton, Slider } from "@material-ui/core";
import {
  PauseCircleFilled,
  PlayCircleFilled,
  SkipNextSharp,
  SkipPreviousSharp,
  VolumeDown,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setNextSong } from "../../store/musicReducer";
import classes from "./MusicPlayer.module.css";

import { isMobile } from "react-device-detect";

const postSelector = (state) => state.music;

// let initialRef = 0;

function MusicPlayer({
  currentTime,
  setCurrentTime,
  songs,
  songName,
  setSongName,
  lyrics,
  setLyrics,
  trial,
}) {
  const { song, isPlaying, album, language, user, favouriteId } = useSelector(
    postSelector,
    shallowEqual
  );
  // console.log(favouriteId)
  const dispatch = useDispatch();

  // const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showDetails, setshowDetails] = useState(false);
  const [isLyrics, setIsLyrics] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songTime, setSongTime] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  const handleIsLyrics = (event, newValue) => {
    setIsLyrics(newValue);
  };

  const audioPlayer = useRef();
  const animationRef = useRef();
  const volumePreState = useRef();
  const initialRef = useRef(0);

  // auto change song name while playing..
  useEffect(() => {
    let calcSecs = !isChanged
      ? calculateSeconds(songs[currentSongIndex]?.Song_Length)
      : songTime;
    // console.log(songs)
    let tempIndex = currentSongIndex;
    let roundCurrentTime = Math.floor(currentTime);

    let fullLengthOfSong = calculateSeconds(
      songs[songs?.length - 1]?.Song_Length
    );

    if (roundCurrentTime >= fullLengthOfSong) {
      setCurrentSongIndex(0);
      setIsChanged(false);
      setSongName(songs[0]?.Song_Name);
      setLyrics(songs[0]?.Song_Lyrics);
      return;
    }

    if (roundCurrentTime >= calcSecs) {
      tempIndex += 1;
      setCurrentSongIndex(tempIndex);

      calcSecs += calculateSeconds(songs[tempIndex]?.Song_Length);
      // console.log(songs[tempIndex])
      setSongName(songs[tempIndex].Song_Name);
      setLyrics(songs[tempIndex]?.Song_Lyrics);

      setSongTime(calcSecs);
      setIsChanged(true);
      return;
    }
  }, [currentTime]);
  // set song from playlist
  // useEffect(() => {
  //     songs?.some((s) => {
  //         if (s?._id === favouriteId) {
  //             console.log(s)
  //             let calcSecs = calculateSeconds(s?.Song_Length)
  //             console.log(calcSecs)
  //             setSongTime(calcSecs)
  //             setSongName(s?.Song_Name)
  //             setCurrentTime(calcSecs)
  //             return
  //         } else {
  //             console.log('not found')
  //         }
  //     })
  // }, [])
  // console.log(currentTime)

  // auto play song
  useEffect(() => {
    // audioPlayer.current.play();

    setTimeout(() => {
      togglePlayPause();
      // dispatch(setIsPlaying(true))
    }, 100);
    // console.log("screen");
  }, []);

  useEffect(() => {
    if (initialRef.current > 1) {
      try {
        let url = process.env.base_url + "/history/add";
        let data = {
          songName: song.Song_Name,
          albumName: song.Album_Name,
          userEmail: user.email,
          createdAt: new Date().getTime(),
        };
        axios.post(url, data);
      } catch (e) {
        // Nothing
      }
      defaultHandler(true);
    }

    return () => {
      defaultHandler(false);
      initialRef.current++;
    };
  }, [song]);

  // set Default once song is done playing.
  useEffect(async () => {
    if (Math.floor(audioPlayer.current?.duration) === Math.floor(currentTime)) {
      dispatch(setNextSong(song));
      defaultHandler(true);
    }
  }, [audioPlayer.current?.duration, currentTime]);

  // function songJump() {
  //     if (locked) return;
  //     document.getElementById("audioPlayer").currentTime = myCommutativeLength;
  //     setCurrentTime(myCommutativeLength);
  //     setSongName(albumSong?.Song_Name)
  //     setLyrics(albumSong?.Song_Lyrics)

  // }

  function defaultHandler(play) {
    setCurrentTime(0);
    // setCopyCurrentTime(0)
    dispatch(setIsPlaying(play));
    if (play) {
      setTimeout(() => {
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      }, 100);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }

  // Calculate the Streaming Time
  function calculateTime(secs) {
    if (secs) {
      const minutes = Math.floor(secs / 60);
      const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(secs % 60);
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      return `${returnedMinutes}:${returnedSeconds}`;
    }
  }

  function togglePlayPause() {
    const prevValue = isPlaying;
    dispatch(setIsPlaying(!prevValue));
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }

  // Connect progress bar(Slider) with the currrent time.
  function whilePlaying() {
    setCurrentTime(audioPlayer.current?.currentTime);
    // setCopyCurrentTime(audioPlayer.current?.currentTime)
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  function changeMusicTime(e, value) {
    // console.log(value, currentTime)
    if (value < currentTime) return;
    if (value) {
      audioPlayer.current.currentTime = value;
      setCurrentTime(value);
      // setCopyCurrentTime(value)
    }
  }

  function changeVolume(e, value) {
    audioPlayer.current.volume = value;
    setVolume(value);
  }

  function handleVolume() {
    if (volume) {
      setVolume(0);
      audioPlayer.current.volume = 0;
      volumePreState.current = volume;
    } else {
      setVolume(volumePreState.current);
      audioPlayer.current.volume = volumePreState.current;
    }
  }

  function songDuration(duration) {
    return duration && typeof duration === "number" && duration;
  }

  function calculateSeconds(hms) {
    var a = hms.split(":");
    let seconds = a[0] * 60 + +a[1];
    if (a.length > 2) {
      seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    }
    return seconds;
  }

  // function jumpNext() {
  //     let count = 0;
  //     let found = false;
  //     let foundId = null;
  //     songs.map((songLocal, i) => {
  //         if (song._id === songLocal._id) {
  //             found = true;
  //             foundId = i;
  //             count += calculateSeconds(songLocal.Song_Length);
  //             alert(count);
  //         }
  //         if (!found) {
  //             count += calculateSeconds(songLocal.Song_Length);
  //         }
  //         if (foundId && foundId + 1 === songs.length) {
  //             count = 0;
  //         }
  //     });
  //     alert(count);
  //     document.getElementById("audioPlayer").currentTime = count;
  //     setCurrentTime(count);
  // }

  // function jumpPrevious() {
  //     let count = 0;
  //     let found = false;
  //     songs.map((songLocal, i) => {
  //         if (song._id === songLocal._id) {
  //             found = true;
  //         }
  //         if (!found) {
  //             count += calculateSeconds(song.Song_Length);
  //         }
  //     });
  //     document.getElementById("audioPlayer").currentTime = count;
  //     setCurrentTime(count);
  // }

  return (
    <div
      style={showDetails ? { height: "50vh" } : { height: 130 }}
      className={`${classes.albumsMusicContainer} `}
    >
      <div className={classes.albumsMusicPlayer}>
        <div className={classes.albumsMusicPlayerProfile}>
          <div className={classes.musicTrackImage}>
            <Image
              src={`${process.env.media_url}/${song?.Album_Image}`}
              alt=""
              width="75"
              height="75"
              layout="responsive"
            />
          </div>
          <div className={classes.albumsMusicPlayerTitle}>
            <h4>{song?.Album_Name}</h4>
            {/* <h3>{song?.Song_Name}</h3> */}
            <h3>{songName}</h3>
          </div>
        </div>

        <div className={classes.albumsMusicPlayerMain}>
          <div className={classes.musicController}>
            <IconButton
              // onClick={isMobile ? "" : () => dispatch(setPreviousSong(song))}
              // onClick={isMobile ? "" : ""}
              // onClick={isMobile ? "" : ""}
              aria-label="previous song"
              // className={`${classes.musicControllerBtn} ${isMobile ? classes.disableIcon : null}`}
              className={`${classes.musicControllerBtn} ${
                isMobile ? classes.disableIcon : classes.disableIcon
              }`}
              // disabled={isMobile ? true : false}
              disabled={isMobile ? true : true}
            >
              <SkipPreviousSharp fontSize="large" />
            </IconButton>
            <IconButton
              aria-label={!isPlaying ? "play" : "pause"}
              onClick={togglePlayPause}
              className={classes.musicControllerBtn}
            >
              {!isPlaying ? (
                <PlayCircleFilled style={{ fontSize: "3.5rem" }} />
              ) : (
                <PauseCircleFilled style={{ fontSize: "3.5rem" }} />
              )}
            </IconButton>
            <IconButton
              // onClick={isMobile ? "" : () => dispatch(setNextSong(song))}
              // onClick={isMobile ? "" : ""}
              aria-label="next song"
              // disabled={isMobile ? true : false}
              disabled={isMobile ? true : true}
              // className={`${classes.musicControllerBtn} ${isMobile ? classes.disableIcon : null}`}
              className={`${classes.musicControllerBtn} ${
                isMobile ? classes.disableIcon : classes.disableIcon
              }`}
            >
              <SkipNextSharp fontSize="large" />
            </IconButton>
          </div>
          <audio
            autoPlay={true}
            ref={audioPlayer}
            id="audioPlayer"
            preload="auto"
            src={`${process.env.media_url}/${song?.Song_File}`}
            type="audio/mp3"
          >
            {/* <source  src={`songs/${song}.mp3`} type="audio/mp3" /> */}
            Your browser does not support the audio element.
          </audio>
          <div className={classes.slider}>
            <p>{!currentTime ? "00:00" : calculateTime(currentTime)}</p>
            <Slider
              style={{ flex: 1, width: "100%" }}
              // value={currentTime}
              value={typeof currentTime === "number" ? currentTime : 0}
              onChange={changeMusicTime}
              aria-labelledby="input-slider"
              disabled={trial}
              max={songDuration(audioPlayer.current?.duration)}
            />
            <p>
              {song && song?.Song_Length}
              {/* {!calculateTime(audioPlayer.current?.duration) ? "00:00" : calculateTime(audioPlayer.current?.duration)} */}
            </p>
          </div>
        </div>
        <div className={classes.musicOptionWrapper}>
          {song.Song_Lyrics && (
            <span
              className={`${classes.musicLyrics} ${classes.musicLyricsIconW}`}
            >
              <span
                className={`${classes.tab} ${classes.musicLyricsIcon} ${classes.active}`}
                onClick={() => setshowDetails(!showDetails)}
              >
                {language.title === "nl" ? "LIEDTEKSTEN" : "LYRICS"}
              </span>
            </span>
          )}
          <div className={classes.musicVolume}>
            <IconButton onClick={handleVolume}>
              {!volume ? (
                <VolumeOff />
              ) : volume > 0.5 ? (
                <VolumeUp />
              ) : (
                <VolumeDown />
              )}
            </IconButton>
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={changeVolume}
              step={0.01}
              max={1}
            />
          </div>
        </div>
      </div>
      {showDetails && (
        <div className={classes.albumsMusicDetails}>
          {/* <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={isLyrics}
                                onChange={handleIsLyrics}
                                aria-label="basic tabs example"
                                textColor="inherit"
                                indicatorColor="primary"
                                centered
                            >
                                <Tab label="Song Lyrics" style={{ marginRight: "10px", padding: "10px" }} {...a11yProps(1)} />
                                <Tab label="Album Details" style={{ padding: "10px" }} {...a11yProps(0)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={isLyrics} index={0}>
                            <span className={classes.lyricsText}>{song.Song_Lyrics && song.Song_Lyrics}</span>
                        </TabPanel>
                        <TabPanel value={isLyrics} index={1}>
                            <span className={classes.lyricsText}>{album.Song_Desc && album.Song_Desc}</span>
                        </TabPanel>
                    </Box> */}
          <div className={classes.tabsWrapper}>
            <div
              className={`${classes.tab} ${
                isLyrics === 0 ? classes.active : ""
              }`}
              onClick={() => {
                setIsLyrics(0);
              }}
            >
              {language.title === "nl" ? "LIEDTEKSTEN" : "LYRICS"}
            </div>
            <div
              className={`${classes.tab} ${
                isLyrics === 1 ? classes.active : ""
              }`}
              onClick={() => {
                setIsLyrics(1);
              }}
            >
              {language.title === "nl" ? "ALBUM DETAILS" : "ALBUM DETAILS"}
            </div>
          </div>
          <div className={classes.tabsContentWrapper}>
            {/* {isLyrics === 0 ? <span className={classes.lyricsText}>{song.Song_Lyrics && song.Song_Lyrics}</span> : ""}
                        {isLyrics === 1 ? <span className={classes.lyricsText}>{album.Song_Desc && album.Song_Desc}</span> : ""} */}
            {isLyrics === 0 ? (
              <span className={classes.lyricsText}>
                {lyrics ? lyrics : "No Lyrics Available"}
              </span>
            ) : (
              ""
            )}
            {isLyrics === 1 ? (
              <span className={classes.lyricsText}>
                {album.Song_Desc && album.Song_Desc}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
}

{
  /* <h2 className={classes.lyricsHeading}>Lyrics</h2>
<br />
<p className={classes.lyricsText}>{song.Song_Lyrics && song.Song_Lyrics}</p> */
}

export default React.memo(MusicPlayer);
