import { Drawer, List, ListItem } from "@material-ui/core";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import api from "./../../../services/api";
import {
  setLanguageMode,
  setSong,
  setSongs,
  setUser,
} from "./../../store/musicReducer";
import SideDrawer from "./../sideDrawer/SideDrawer";
import classes from "./Header.module.css";

const postSelector = (state) => state.music;

function Header() {
  const router = useRouter();

  const { user, language } = useSelector(postSelector, shallowEqual);

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(user);
  const [expireDays, setExpireDays] = useState(null);
  const [error, setError] = useState("");

  const getLocationInfo = async () => {
    const { data } = await axios.get("https://api.db-ip.com/v2/free/self");

    if (data.countryCode === "NL") {
      dispatch(
        setLanguageMode({
          title: "nl",
          src: "nl-2.jpg",
        })
      );

      router.push(`${router.route}?lang=nl`);
    }
  };

  const fetchExpiringDays = async () => {
    try {
      const { data } = await api.get(`/api/expiring-days/${user.email}`);

      if (data) {
        // console.log("API ExpiringDays Data >>>>>>>>", data);
        setExpireDays(data);
        localStorage.setItem("Expiring-Days-Api", JSON.stringify(data));
      }

      if (user) {
        setUserInfo({ ...user, expiringDays: data?.data?.days });
      }
    } catch (err) {
      console.error(
        "err?.response?.data?.message >>>>>>>>>>",
        err?.response?.data?.message
      );

      if (
        err?.response?.data?.message === "Your trial period has been expired!"
      ) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.removeItem("songArray");
          localStorage.removeItem("Expiring-Days-Api");
          localStorage.removeItem("subscriptionSongDetails");
          localStorage.removeItem("music-app-credentials");

          dispatch(setSong({}));
          dispatch(setSongs([]));
          dispatch(setUser(null));

          const trialObj = {
            expired: true,
            message: err?.response?.data?.message,
            email: err?.response?.data?.data?.user,
          };

          localStorage.setItem("trial-info", JSON.stringify(trialObj));

          router.replace("/extend-subscription");
        }
      } else {
        setError(err?.response?.data?.message);

        setTimeout(() => {
          setError("");
        }, 3000);
      }

      /* if (typeof window !== "undefined") {
        // Perform localStorage action

        if (localStorage.getItem("trial-info")) {
          localStorage.removeItem("songArray");
          localStorage.removeItem("Expiring-Days-Api");
          localStorage.removeItem("subscriptionSongDetails");
          localStorage.removeItem("music-app-credentials");

          dispatch(setSong({}));
          dispatch(setSongs([]));
          dispatch(setUser(null));
        } else {
          const trialObj = {
            expired: true,
            message: err?.response?.data?.message,
            email: err?.response?.data?.data?.user,
          };

          if (typeof window !== "undefined") {
            // Perform localStorage action
            localStorage.setItem("trial-info", JSON.stringify(trialObj));
          }
        }

        router.replace("/extend-subscription");
      }

      setError(err?.response?.data?.message);

      setTimeout(() => {
        setError("");
      }, 3000); */
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpiringDays();
    }
  }, [user]);

  const [open, setOpen] = useState(false);
  const [sideBar, setShowSidebar] = useState(false);
  const [checkCredentials, setCheckCredentials] = useState(null);

  useEffect(() => {
    getLocationInfo();

    if (window.innerWidth < 992) {
      setShowSidebar(true);
    }

    window.addEventListener("resize", () => {
      setOpen(false);
      if (window.innerWidth < 992) {
        setShowSidebar(true);
      }
      if (window.innerWidth > 991) {
        setShowSidebar(false);
      }
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    if (userInfo?.expiresIn || userInfo?.expiresIn === 0) {
      window.onbeforeunload = function () {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.removeItem("music-app-credentials");
        }

        // return "Do you really want to close?"; //prompts user
      };
    }

    let credentialsExist;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      credentialsExist = localStorage.getItem("music-app-credentials");
    }

    setCheckCredentials(credentialsExist);
  }, [user]);

  // minor

  function handleToggle() {
    setOpen((preSrate) => !preSrate);
  }

  const drawer = (
    <Drawer open={open} onClose={handleToggle}>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.drawerList}
      >
        <div
          style={{ cursor: "pointer" }}
          className={classes.headerMainImage}
          onClick={handleToggle}
        >
          <Image
            priority
            src={`/images/${
              language.title === "nl" ? "logo_dutch" : "logo"
            }.svg`}
            alt=""
            width={250}
            height={50}
            layout="responsive"
          />
        </div>
        <ul>
          {nav.map(({ route, title }, i) =>
            user && title === "LOGIN" ? null : (
              <ListItem
                key={i}
                button
                component="li"
                className={classes.drawerListItem}
              >
                <Link href={route}>{title}</Link>
              </ListItem>
            )
          )}
        </ul>
      </List>
    </Drawer>
  );

  const handleSubscription = () => {
    // let body = {
    // }
    // try{
    //     let res =
    //     console.log(res)
    // }
    // catch(err){
    // console.error(err);
    // }
  };

  return (
    <header className={`${classes.header} ${classes.headerActive}`}>
      <div className={classes.headerTop}>
        {sideBar && (
          <div className={classes.headerLogo}>
            {/* <IconButton onClick={handleToggle}>
                            <Menu />
                        </IconButton> */}

            {userInfo?.expiresIn === undefined ? (
              <div
                className={classes.playlistMobile}
                // onClick={() => console.log("clicked")}
              >
                <SideDrawer />
              </div>
            ) : null}

            <Link href="/">
              <a>
                <Image
                  src={`/images/${
                    language.title === "nl" ? "logo_dutch" : "logo"
                  }.svg`}
                  alt={language.title}
                  width={200}
                  height={50}
                  layout="fixed"
                />
              </a>
            </Link>
            {user && (
              <>
                {
                  // userInfo?.expiresIn &&
                  userInfo?.expiresIn >= 0 ? (
                    <div className={classes.timer}>
                      <p>
                        Your Trial Period Expires{" "}
                        {userInfo?.expiresIn === 0
                          ? "Today"
                          : `In ${userInfo?.expiresIn} Days`}{" "}
                      </p>
                    </div>
                  ) : (
                    // userInfo?.expiringDays &&
                    userInfo?.expiringDays >= 0 && (
                      <div className={classes.timer}>
                        <p>
                          Your Trial Period Expires{" "}
                          {userInfo?.expiringDays === 0
                            ? "Today"
                            : `In ${userInfo?.expiringDays} Days`}{" "}
                        </p>
                      </div>
                    )
                  )
                }
              </>
            )}
          </div>
        )}
        {/* <div className={classes.search}>
                    <IconButton>
                        <Search />
                    </IconButton>
                    <input type="text" placeholder="Search for the songs, albums etc.." />
                </div> */}
        {/* <nav className={classes.menu}>
                    <ol>
                        <li className={classes.menuItem}>
                            <div className={classes.DropDown_Main}>
                                <Image alt="" src={`/images/${language.src}`} width={35} height={25} />
                            </div>
                            <ol className={classes.subMenu}>
                                {languages.map((lan, index) => (
                                    <li key={index} className={classes.menuItem} onClick={() => handleLanguage(lan)}>
                                        <Image alt="" src={`/images/${lan.src}`} width={35} height={25} />
                                    </li>
                                ))}
                            </ol>
                        </li>
                    </ol>
                    <div className={classes.headerActions}>
                        {user && (
                            <IconButton onClick={handleLogout}>
                                <Image src="/images/logout-white.png" alt="" width={30} height={25} />
                            </IconButton>
                        )}
                    </div>
                </nav> */}
      </div>
      {!sideBar && (
        <div className={classes.headerMain}>
          <div className={classes.headerMainImage}>
            {/* <div onClick={() => handleSubscription()} style={{ position: "fixed", left: "30px" }}>
                            Subscription
                        </div> */}
            {userInfo?.expiresIn === undefined && (
              <div className={classes.playlistDesktop}>
                {checkCredentials !== null && <SideDrawer />}
              </div>
            )}
            <Link href="/">
              <a>
                <Image
                  src={`/images/${
                    language.title === "nl" ? "logo_dutch" : "logo"
                  }.svg`}
                  alt=""
                  width={550}
                  height={150}
                  layout="intrinsic"
                />
              </a>
            </Link>
            {user && (
              <>
                {
                  // userInfo?.expiresIn &&
                  userInfo?.expiresIn >= 0 ? (
                    <div className={classes.timer}>
                      <p>Your Trial Period Expires. </p>
                      <p>
                        {user?.expiresIn === 0
                          ? "Today"
                          : `In ${user?.expiresIn}  Days`}{" "}
                      </p>
                    </div>
                  ) : (
                    // userInfo?.expiringDays &&
                    userInfo?.expiringDays >= 0 && (
                      <div className={classes.timer}>
                        <p>
                          Your Trial Period Expires{" "}
                          {userInfo?.expiringDays === 0
                            ? "Today"
                            : `In ${userInfo?.expiringDays} Days`}{" "}
                        </p>
                      </div>
                    )
                  )
                }
              </>
            )}
          </div>
          <nav className={classes.headerNavigation}>
            <ul>
              {nav.map(({ route, title }, i) =>
                user && title === "LOGIN" ? null : (
                  <li key={i}>
                    <Link href={route}>{title}</Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      )}
      {/* {drawer} */}
    </header>
  );
}

export default Header;

const nav = [
  // {
  //     title: "STREAMING",
  //     route: "/",
  // },
  // {
  //     title: "HOME",
  //     route: "/",
  // },
  // {
  //     title: "CD STORE",
  //     route: "/",
  // },
  // {
  //     title: "SHEET MUSIC",
  //     route: "/",
  // },
  // {
  //     title: "BIOGRAPHY",
  //     route: "/",
  // },
  // {
  //     title: "NEW & EVENTS",
  //     route: "/",
  // },
  // {
  //     title: "GUESTBOOK",
  //     route: "/",
  // },
  // {
  //     title: "LOGIN",
  //     route: "",
  // },
];

// const languages = [
//   {
//     title: "nl",
//     src: "nl.jpg",
//   },
//   {
//     title: "eng",
//     src: "usa.jpg",
//   },
// ];
