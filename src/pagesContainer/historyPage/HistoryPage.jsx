import { IconButton } from "@material-ui/core";
import { MusicNote } from "@material-ui/icons";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import classes from "./HistoryPage.module.css";

const postSelector = (state) => state.music;

const HistoryPage = ({ userEmail }) => {
  console.log("HistoryPage >>>>>>>>");

  const { user } = useSelector(postSelector, shallowEqual);
  const route = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(async () => {
    if (userEmail !== undefined) {
      const { data } = await axios.get(
        `${process.env.base_url}/history/${userEmail.replace(/-/g, " ")}`
      );
      setHistory(data[0]);
    }
  }, [userEmail]);

  const convertTime = (d) => {
    return new Date(d).toLocaleString();
  };

  // const redirectMe = () => {
  //     route.push(`/`);
  // };

  return (
    <div className={classes.albums}>
      <Head>
        <title>History</title>
        <meta name="description" content="history" />
      </Head>
      <br />
      <h4 style={{ color: "white", textAlign: "center" }}>
        RECENTLY PLAYED SONGS
      </h4>
      <h1>History</h1>
      <div className={classes.tabWrapper}>
        {user?.email === userEmail ? (
          history ? (
            history.map((item, index) => {
              return (
                <div
                  className={`${classes.musicTrack}`}
                  key={index}
                  onClick={() => {
                    route.push(`/album/${item.albumName}`);
                  }}
                >
                  <div className={classes.musicTrackLeft}>
                    <IconButton className={classes.songTune}>
                      <MusicNote />
                    </IconButton>
                    <span className={classes.nameWrapper}>
                      <h4>{item.songName}</h4>
                      <p className={classes.nameP}>{item.albumName}</p>
                    </span>
                  </div>
                  <div className={classes.musicTrackRight}>
                    <p className={classes.playAgain}>
                      {convertTime(parseInt(item.createdAt))}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <h4 style={{ color: "grey", textAlign: "center" }}>Loading...</h4>
          )
        ) : (
          <h4 style={{ color: "grey", textAlign: "center" }}>Loading...</h4>
        )}
      </div>
    </div>
  );
};
// Nothing

export default React.memo(HistoryPage);
