import { Lock } from "@material-ui/icons";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { forwardRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import classes from "./Card.module.css";

// import axios from "axios";
// import { setSongs, setSong } from "../../store/musicReducer";

const postSelector = (state) => state.music;

const Card = forwardRef(
  ({ album, url, index, trial, disableFetch, setLoading }, ref) => {
    const [error, setError] = useState(false);
    const { user } = useSelector(postSelector, shallowEqual);
    // const [liked, setLiked] = useState(false);
    // const [trial, setTrial] = useState(false)
    // const [loading, setLoading] = useState(true);

    const route = useRouter();

    // const dispatch = useDispatch();
    // console.log(index, expiry)

    function handleClick() {
      setLoading(true);
      if (!user) {
        route.replace("/login");
        return;
      }
      if (disableFetch) return;
      if (user?.hasOwnProperty("expiresIn")) {
        index === 0
          ? route.push(`/album/${album?.Album_Name}`)
          : handleExpireAlert();
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
      }, 2000);
    };

    return (
      <div
        ref={ref}
        className={classes.card}
        onClick={handleClick}
        style={disableFetch && { cursor: "auto" }}
      >
        {error && (
          <Alert className={classes.alert} severity="error">
            Not Available In Trial Period
          </Alert>
        )}
        {trial && index !== 0 && (
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

        <div className={classes.cardImage} style={{ width: 280, height: 280 }}>
          <Image src={url} alt="" width={280} height={280} />
        </div>
        <h3>{album?.Album_Name}</h3>
      </div>
    );
  }
);

Card.displayName = "Card";

export default React.memo(Card);
