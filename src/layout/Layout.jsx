import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Header from "../components/header/Header";
import { setLanguageMode, setUser } from "../store/musicReducer";
import classes from "./Layout.module.css";

const postSelector = (state) => state.music;
function Layout({ children }) {
  const { language } = useSelector(postSelector, shallowEqual);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router.query.lang) {
      dispatch(
        setLanguageMode({ ...router.query, src: `${router.query?.lang}-2.jpg` })
      );
    }

    let user;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      user = JSON.parse(localStorage.getItem("music-app-credentials"));
    }

    dispatch(setUser(user));
  }, []);

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="https://www.janmulder.us/app/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="https://www.janmulder.us/app/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="https://www.janmulder.us/app/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="https://www.janmulder.us/app/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="https://www.janmulder.us/app/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="https://www.janmulder.us/app/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="https://www.janmulder.us/app/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://www.janmulder.us/app/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://www.janmulder.us/app/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="https://www.janmulder.us/app/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://www.janmulder.us/app/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="https://www.janmulder.us/app/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://www.janmulder.us/app/favicon-16x16.png"
        />
        <meta
          name="msapplication-TileImage"
          content="https://www.janmulder.us/app/ms-icon-144x144.png"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="mobile-web-app-title" content="Mulder Streaming" />
        <meta name="msapplication-TileColor" content="#523a1d" />
        {/* <link rel="manifest" href="https://www.janmulder.us/app/manifest.json" /> */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#523a1d" />
        <title>Mulder Music Streaming</title>
        <meta name="description" content="Mulder Music Streaming." />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
      </Head>

      <div className={classes.layout}>
        <Header />
        <main className={classes.layoutMain}>{children}</main>
      </div>
    </>
  );
}

export default Layout;
