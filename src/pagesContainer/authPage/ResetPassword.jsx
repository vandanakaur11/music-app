import { Button, FormControlLabel } from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useState } from "react";
import classes from ".Page.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { setUser } from "../../store/musicReducer";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Head from "next/head";

const postSelector = (state) => state.music;

const ResetPassword = ({ isSignIn }) => {
  console.log("ResetPassword >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [isForget, setIsForget] = useState(false);

  // console.log({ email, accessCode });
  // console.log(router.query.email ? router.query.email : "", router.query.access_code ? router.query.access_code : "");

  useEffect(() => {
    let user;
    if (typeof window !== "undefined") {
      // Perform localStorage action
      user = JSON.parse(localStorage.getItem("music-app-credentials"));
    }

    if (user?.token.length > 30) router.replace("/");

    let pageName = router.asPath.slice(1, 7);
    if (pageName === "signup") {
      try {
        let query = router.asPath.slice(8).split("&");
        let subQuery = [];
        for (let i in query) {
          subQuery.push(query[i].split("="));
        }
        let access_code = findParam("access_code", subQuery);
        let email = findParam("email", subQuery);
        setEmail(email);
        setAccessCode(access_code);
      } catch (e) {
        // Do nothing
        console.log(e);
      }
    }
  }, []);

  const findParam = (name, array) => {
    for (let i in array) {
      if (array[i][0] === name) {
        return array[i][1];
      }
    }
    return "";
  };

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    const payload =
      isSignIn && !isForget
        ? { email, password, code: accessCode }
        : { email, password, code: accessCode };

    const url = process.env.base_url + (!isSignIn ? "/signup" : "/signin");

    try {
      const { data } = await axios.post(url, payload);
      // console.log(data);
      setLoading(false);

      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.setItem("music-app-credentials", JSON.stringify(data));
      }

      dispatch(setUser(data));

      router.push("/");
    } catch (err) {
      setLoading(false);
      console.log({ err });
      setError(err?.response?.data);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }

  const loginTextEng = isSignIn ? "Login" : "Reset Password";
  const loginTextNl = isSignIn ? "Inloggen" : "Maak uw account aan";
  const codePromiseText =
    language.title === "nl"
      ? "Ik ben de exclusieve gebruiker van deze account en beloof de muziek niet te delen met derden."
      : "I promise this account will only be used by me, and not to share any of the content with others.";

  return (
    <form onSubmit={handleSubmit} className={classes.auth}>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? loginTextNl : loginTextEng}{" "}
        </title>
      </Head>

      <h1>
        {isForget
          ? "Reset"
          : language.title === "nl"
          ? loginTextNl
          : loginTextEng}
      </h1>
      {loading && <h3>Loading..</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div className={classes.input}>
        <label htmlFor="">
          {isForget ? (language.title === "nl" ? "Nieuw" : "New") : ""}{" "}
          {language.title === "nl" ? "Wachtwoord" : "Password"}
        </label>
        <input
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
          minLength={6}
          maxLength={36}
          placeholder={
            isForget
              ? language.title === "nl"
                ? "Nieuw Wachtwoord"
                : "Your New Password"
              : language.title === "nl"
              ? "Wachtwoord"
              : "Your Password"
          }
        />
      </div>
      {!isSignIn || isForget ? (
        <div className={classes.input}>
          <label htmlFor="">
            {language.title === "nl" ? "Toegangscode" : "Access Code"}
          </label>
          <input
            value={accessCode}
            // disabled={!isSignIn ? true : false}
            onChange={
              isSignIn
                ? (e) => {
                    setAccessCode(e.target.value);
                  }
                : (e) => {
                    setAccessCode(e.target.value);
                  }
            }
            type="text"
            required
            minLength={7}
            maxLength={10}
            placeholder={
              language.title === "nl" ? "Toegangscode" : "Access Code"
            }
          />
        </div>
      ) : (
        ""
      )}
      <Button type="submit" variant="contained">
        {/* {isForget && language.title === "nl" ? "Resetten" : isForget && language.title === "eng" ? "Reset" : loginTextEng} */}
        Submit
      </Button>
      <br />
      <p>
        <span className={classes.linkBoxWrapper}>Back to Login</span>
      </p>
    </form>
  );
};

export default ResetPassword;
