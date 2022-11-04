import { Drawer, List, ListItem } from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SideDrawer from "../sideDrawer/SideDrawer";
import classes from "./Header.module.css";
import api from "./../../../services/api";

const postSelector = (state) => state.music;

function Header() {
  const { user, language } = useSelector(postSelector, shallowEqual);

  const [userInfo, setUserInfo] = useState(user);
  const [expireDays, setExpireDays] = useState(null);

  // let expiringDays;
  // console.log("stateExpiringDays", expireDays);

  const fetchExpiringDays = async (userEmail) => {
    // console.log("userEmail >>>>>>>>>>>", userEmail);

    try {
      const { data } = await api.get(`/api/expiring-days/${userEmail}`);

      if (data) {
        // console.log("API ExpiringDays Data >>>>>>>>", data);
        setExpireDays(data);
        localStorage.setItem("Expiring-Days-Api", JSON.stringify(data));
      }

      if (user) {
        setUserInfo({ ...user, expiringDays: data?.data?.days });
      }
    } catch (err) {
      console.error("err >>>>>>>>>>", err);

      //   setError(err?.response?.data?.message);

      //   setTimeout(() => {
      //     setError("");
      //   }, 3000);
    }
  };

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   expiringDays = JSON.parse(localStorage.getItem("Expiring-Days-Api"));
    // }
    // console.log("ExpiringDays-from-Api=====>", expiringDays?.data?.days);

    // if (user) {
    //   setUserInfo({ ...user, expiringDays: expiringDays?.data?.days });
    // }

    const newUser = JSON.parse(localStorage.getItem("music-app-credentials"));
    // console.log("LoggedIn Users ===>", user);
    // console.log("LoggedIn Users ===>", newUser);

    if (!newUser?.expiresIn) {
      if (user) {
        fetchExpiringDays(newUser?.data?.user?.email);
      }
    }
  }, [user]);

  // console.log("Header user >>>>>>>>>>>>", userInfo);
  // console.log(
  //   "Header userInfo.expiringDays >>>>>>>>>>>>",
  //   userInfo?.expiringDays
  // );

  // console.log(
  //   "Header user user?.data?.user?.subscriptionEndDate >>>>>>",
  //   userInfo?.data?.user?.subscriptionEndDate
  // );
  //  console.log("ExpiringDays-from-Api=====>", userInfo?.expiringDays);

  const [open, setOpen] = useState(false);
  const [sideBar, setShowSidebar] = useState(false);
  const [checkCredentials, setCheckCredentials] = useState(null);

  useEffect(() => {
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
