import { Lock } from "@material-ui/icons";
import { ConstructionOutlined } from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { forwardRef, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { setAlbum } from "../../store/musicReducer";
import classes from "./Card.module.css";

// import axios from "axios";
// import { setSongs, setSong } from "../../store/musicReducer";

const postSelector = (state) => state.music;

const Card = forwardRef(
  (
    { subscriptionAlbum, album, url, index, trial, disableFetch, setLoading },
    ref
  ) => {
    // console.log("index >>>>>>>>>>>>>>", index);
    // console.log("SubscriptionAlbum >>>>>>>>>>>>>>", subscriptionAlbum);
    // console.log("Album-from-card===>",album)

    const [error, setError] = useState(false);
    // const [subscriptionAlbum, setSubscriptionAlbum] = useState(null);
    const [msg, setMsg] = useState(false);
    const { user } = useSelector(postSelector, shallowEqual);
    // const [albumName,setAlbumName]=useState(false)
    // const [liked, setLiked] = useState(false);
    // const [trial, setTrial] = useState(false)
    // const [loading, setLoading] = useState(false);

    const route = useRouter();

    let albumName = false;

    // const dispatch = useDispatch();
    // console.log(index, expiry)
    // console.log(album)
    // if (subscriptionAlbum){
    //   console.log("CARD-PAGE-ALBUM", subscriptionAlbum);
    // }

    subscriptionAlbum?.forEach((elem, index) => {
      if (album?.Album_Name === elem.album) {
        //  console.log("hello world!");
        albumName = true;
      }
    });

    // useEffect(() => {
    //   if (typeof window !== "undefined") {
    //     setSubscriptionAlbum(
    //       JSON.parse(localStorage.getItem("subscriptionSongDetails"))
    //     );
    //   }
    // }, [albumName]);

    //   subscriptionAlbum?.forEach((elem, index) => {
    //     if (album?.Album_Name === elem.album) {
    //       // console.log("hello world!");
    //       albumName = true;
    //     }
    //   });

    // console.log(albumName);

    function handleClick(albumName) {
      // console.log("card clicked....", albumName);
      //  setLoading(true);

      // subscriptionAlbum?.forEach((elem, index) => {
      //   if (elem.album === albumName) {
      //      setMsg(true)
      //     alert("han true");
      //   } else {
      //     setMsg(false)
      //     alert("han false");
      //   }
      // });

      if (!user) {
        route.replace("/login");
        return;
      }

      if (disableFetch) return;

      setLoading(true);

      // console.log(loading)

      if (user?.hasOwnProperty("expiresIn")) {
        //  index===0
        msg ? route.push(`/album/${album?.Album_Name}`) : handleExpireAlert();
      } else {
        route.push(`/album/${album?.Album_Name}`);
      }

      // try {
      // const { data } = await axios.get(`${process.env.base_url}/songs/${album?.Album_Name}`);
      // dispatch(setSongs(data));
      // dispatch(setSong(data[0]));
      // route.push(`/album/${album?.Album_Name}`);
      // } catch (err) {
      //     console.log({ err });
      // }
    }

    const handleExpireAlert = () => {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 3000);
    };

    return (
      <>
        <div
          ref={ref}
          className={classes.card}
          onClick={() => handleClick(album?.Album_Name)}
          style={disableFetch && { cursor: "auto" }}
          disabled={(trial && index === 0) || !albumName}
        >
          {error && (
            <Alert className={classes.alert} severity="error">
              Not Available In Trial Period
            </Alert>
          )}

          {trial && index === 0 && (
            <span className={classes.locked}>
              <span>
                <Lock />
              </span>
            </span>
          )}

          {!albumName && (
            <span className={classes.locked}>
              <span>
                <Lock />
              </span>
            </span>
          )}

          {/* {trial && index !== 0 ? (
                <span className={classes.locked}>
                    <span>
                        <Lock />
                    </span>
                </span>
            ) : (
                <span className={classes.locked}>
                    <span style={{ marginTop: "4px" }}>
                        <FavoriteBorderIcon />
                    </span>
                </span>
            )} */}

          <div
            className={classes.cardImage}
            style={{ width: 280, height: 280 }}
          >
            <Image src={url} alt="" width={280} height={280} />
          </div>
          <h3>{album?.Album_Name}</h3>
        </div>
      </>
    );
  }
);

Card.displayName = "Card";

export default React.memo(Card);
