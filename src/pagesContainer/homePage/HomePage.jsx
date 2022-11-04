import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FlipMove from "react-flip-move";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import downarrow from "../../../public/images/downarrownew.png";
import uparrow from "../../../public/images/uparrownew.png";
import Advertisement from "../../components/advertisment/Advertisment";
import Card from "../../components/card/Card";
import Footer from "../../components/footer";
import { setFavourites } from "../../store/musicReducer";
import api from "./../../../services/api";
import classes from "./HomePage.module.css";

const postSelector = (state) => state.music;

const HomePage = ({ albums }) => {
  // console.log("HomePage >>>>>>>>>>>>>>");

  let albumArray = [];

  albums?.forEach((element) => {
    // console.log(element)
    let { index } = element;
    albumArray[index - 1] = element;
  });

  // console.log(albumArray)

  const { language, user } = useSelector(postSelector, shallowEqual);

  const [openAdd, setOpenAdd] = useState(false);
  const [albumsOrder, setAlbumsOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subsData, setSubsData] = useState(null);
  const [subscriptionAlbum, setSubscriptionAlbum] = useState(null);

  const route = useRouter();
  const dispatch = useDispatch();

  // console.log("homepage user >>>>>>>>>>>>", user);

  // useEffect(() => {
  //   if (!user) {
  //     route?.replace("/login");
  //   }
  // }, []);

  // const [expireDays, setExpireDays] = useState(null);

  // console.log(user)
  // console.log("stateSubscription===>", subsData);
  // console.log("stateExpiringDays", expireDays);

  const fetchSubscription = async (subsID) => {
    // console.log("subsID >>>>>>>>>>>>>", subsID);

    try {
      const { data } = await api.get(`/admin/subscriptions/${subsID}`);

      if (data) {
        // console.log("HomePage Subscription Data >>>>>>>>", data);
        setSubsData(data);
        localStorage.setItem(
          "subscriptionSongDetails",
          JSON.stringify(data?.data?.subscription?.songDetail)
        );
        setSubscriptionAlbum(data?.data?.subscription?.songDetail);
      }
    } catch (err) {
      console.error("err >>>>>>>>>>", err);

      // setError(err?.response?.data?.message);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // const fetchExpiringDays = async (userEmail) => {
  //   console.log("userEmail >>>>>>>>>>>", userEmail);

  //   try {
  //     const { data } = await api.get(`/api/expiring-days/${userEmail}`);

  //     if (data) {
  //       console.log("HomePage ExpiringDays Data >>>>>>>>", data);
  //       setExpireDays(data);
  //       localStorage.setItem("Expiring-Days-Api", JSON.stringify(data));
  //     }
  //   } catch (err) {
  //     console.error("err >>>>>>>>>>", err);

  //     setError(err?.response?.data?.message);

  //     setTimeout(() => {
  //       setError("");
  //     }, 3000);
  //   }
  // };

  if (user?.expiresIn) {
  }

  useEffect(() => {

   let abortController = new AbortController();  

    const newUser = JSON.parse(localStorage.getItem("music-app-credentials"));

    // console.log("LoggedIn Users ===>", newUser);

    // if (!newUser?.expiresIn) {
    // console.log("subscription ID ====>",user.data.user.subscriptionID)

    if (!newUser?.expiresIn) {
      if (user) {
        fetchSubscription(newUser?.data?.user?.subscriptionID);
      }
    }

    // console.log(
    //   "user?.data?.user?.email >>>>>>>>>>",
    //   user?.data?.user?.email
    // );

    // fetchExpiringDays(user?.data?.user?.email);
    // }


    if (!user) {
      route.replace("/login");
    }

    let token;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      // ({ token } = JSON.parse(localStorage.getItem("music-app-credentials")));
      token = JSON.parse(localStorage.getItem("music-app-credentials"));
    }
    // console.log("token====>",token?.token)

    

    const fetchFavourites = async () => {
      try {
        const { data } = await api.get(`/api/getFavourites`, {
          headers: {
            authorization: `Bearer ${token?.token}`,
          },
        });

        // tempArr.push(data?.favourites)

        dispatch(setFavourites(data?.favourites));

        // console.log("get favourites", data.favourites);
      } catch (err) {
        console.error("err >>>>>>>>>>", err);

        setError(err?.response?.data);

        setTimeout(() => {
          setError("");
        }, 3000);
      }
    };
 
    if(user){

      fetchFavourites();
    }
    
       return () => {
         abortController.abort();
       };
  

  }, [user]);

  
  const handleAdd = () => {
    if (!openAdd) {
      setOpenAdd(true);
    } else {
      setOpenAdd(false);
    }
    // console.log(openAdd);
  };

  let theOrder = [];

  albumArray.map((data, ind) => {
    //  console.log(data.index)
    // ind=ind+1;
    // console.log(ind)
    // if(data.index===ind){
    //   for(let i=0; i<=data.length;i++){
    //     // theOrder[i]=data;
    //     theOrder.push(data)
    //     // console.log(data)
    //   }
    //   console.log(theOrder);
    // }
    if (data.Album_Name === "Love Divine 1") {
      theOrder[0] = data;
    }
    if (data.Album_Name === "Love Divine 2") {
      theOrder[1] = data;
    }
    if (data.Album_Name === "Love Divine 3") {
      theOrder[2] = data;
    }
    if (data.Album_Name === "Love Divine 4") {
      theOrder[3] = data;
    }
    if (data.Album_Name === "Love Divine 5") {
      theOrder[4] = data;
    }
    if (data.Album_Name === "Love Divine 6") {
      theOrder[5] = data;
    }
    if (data.Album_Name === "Love Divine 7") {
      theOrder[6] = data;
    }
    if (data.Album_Name === "Christmas") {
      theOrder[7] = data;
    }
    if (data.Album_Name === "Ecossaise Christmas") {
      theOrder[8] = data;
    }
    if (data.Album_Name === "Ian Mulder's Favourite Hymns") {
      theOrder[9] = data;
    }
    if (data.Album_Name === "The Omnipotent") {
      theOrder[10] = data;
    }
    if (data.Album_Name === "Ocean of Dreams 2") {
      theOrder[11] = data;
    }
    if (data.Album_Name === "The Piano Dreamer") {
      theOrder[12] = data;
    }
    if (data.Album_Name === "Sounds of Silence") {
      theOrder[13] = data;
    }
    if (data.Album_Name === "Ocean of Dreams") {
      theOrder[14] = data;
    }
    if (data.Album_Name === "Grandezza") {
      theOrder[15] = data;
    }
    if (data.Album_Name === "Ian Mulder in Concert") {
      theOrder[16] = data;
    }
    if (data.Album_Name === "Ecossaise 2") {
      theOrder[17] = data;
    }
    if (data.Album_Name === "Ecossaise 1") {
      theOrder[18] = data;
    }
    if (data.Album_Name === "Coming to America") {
      theOrder[19] = data;
    }
  });

  // console.log(albumsOrder)

  useEffect(() => {
    setAlbumsOrder(theOrder);
  }, []);
  // console.log(albumsOrder);

  return (
    <div className={classes.homePage}>
      {/* {loading && <h3>Loading..</h3>} */}

      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <br />
      <h4 style={{ color: "white", textAlign: "center" }}>STREAMING</h4>
      {/* Code for Advertisement (start) */}

      <div className={classes.addcontainer}>
        <div className={classes.addcontainerInner}>
          <h3 className={classes.addheading} onClick={() => handleAdd()}>
            Exclusive Video
          </h3>

          {!openAdd ? (
            <div>
              <Image
                src={downarrow}
                width={16}
                height={16}
                className={classes.arrows}
                onClick={() => handleAdd()}
              />
            </div>
          ) : (
            <div>
              <Image
                src={uparrow}
                width={16}
                height={16}
                className={classes.arrows}
                onClick={() => handleAdd()}
              />
            </div>
          )}
        </div>
        {openAdd && (
          <div className={classes.addwrapper}>
            <Advertisement />
          </div>
        )}
      </div>
      {/* Code for Advertisement (end) */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: "44vw",
          left: "44vw",
          // left: 0,
          // width: "100%",
          // height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        {/* <ClipLoader color="red" loading={loading} size={"10vw"} /> */}
        {loading && (
          <div className={classes.loading}>
            <h1 style={{ fontSize: "2.5rem" }}>Loading...</h1>
          </div>
        )}
      </div>

      <FlipMove className={classes.cards}>
        {albumsOrder?.length > 0 &&
          albumsOrder?.map((album, index) => {
            const url = `${process.env.media_url}/${
              language.title === "eng"
                ? album?.Album_Image
                : album?.Album_Image.replace("eng", "nl")
            }`;

            return (
              <Card
                key={album?._id + language.title}
                album={album}
                url={url}
                index={index}
                trial={user?.hasOwnProperty("expiresIn")}
                setLoading={setLoading}
                subscriptionAlbum={subscriptionAlbum}
              />
            );
          })}
      </FlipMove>

      {/* *********** MY WORK ************* */}
      {/* <FlipMove className={classes.cards}>
        {albumsOrder.length > 0 && (
          <Card
            albumsOrder={albumsOrder}
            setLoading={setLoading}
            trial={user?.hasOwnProperty("expiresIn")}
          />
        )}
      </FlipMove> */}

      {/* https://githubmemory.com/repo/joshwcomeau/react-flip-move/issues/256 */}
      {/* Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. */}
      <Footer />
    </div>
  );
};

export default HomePage;
