import { Button, FormControlLabel } from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/musicReducer";
import classes from ".Page.module.css";

const postSelector = (state) => state.music;

const AuthPage = ({ isSignIn }) => {
  console.log("AuthPage >>>>>>>>");
  console.log("isSignIn >>>>>>>>>>>>", isSignIn);

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

  const loginTextEng = isSignIn ? "Login" : "Sign Up";
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
        <label htmlFor="">Email</label>
        <input
          value={email}
          onChange={
            isSignIn
              ? (e) => {
                  setEmail(e.target.value);
                }
              : (e) => {
                  setEmail(e.target.value);
                }
          }
          // disabled={!isSignIn ? true : false}
          type="email"
          required
          placeholder={
            language.title === "nl" ? "Uw emailadres" : "Your Email Address"
          }
        />
      </div>
      {/* Email */}
      {/* Disable conditions on the basis of /signup and /signup?uduiwe */}

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
      {!isSignIn && (
        <>
          <br />
          <FormControlLabel
            style={{ display: "block" }}
            control={
              <Checkbox
                color="default"
                value={checkBox}
                onClick={() => setCheckBox(!checkBox)}
              />
            }
            label={codePromiseText}
          />
        </>
      )}
      <Button
        disabled={!isSignIn && !checkBox}
        type="submit"
        variant="contained"
      >
        {isForget && language.title === "nl"
          ? "Resetten"
          : isForget && language.title === "eng"
          ? "Reset"
          : loginTextEng}
      </Button>
      <br />
      <p>
        {!isSignIn ? (
          <span onClick={() => router.push("/login")}>
            {language.title === "nl"
              ? "Heeft u al een account? Inloggen."
              : "Already have an account"}
          </span>
        ) : (
          <>
            <span className={classes.linkBoxWrapper}>
              {isForget ? (
                <span
                  onClick={() => {
                    setIsForget(!isForget);
                    setAccessCode("");
                    setPassword("");
                  }}
                >
                  {language.title === "nl"
                    ? "Terug naar Inloggen"
                    : "Back to Login"}
                </span>
              ) : (
                <span
                  onClick={() => {
                    setIsForget(!isForget);
                    setPassword("");
                  }}
                >
                  {language.title === "nl"
                    ? "Wachtwoord vergeten?"
                    : "Forgot Password?"}
                </span>
              )}
              {/* <span onClick={() => router.push("/signup")}>
                                {language.title === "nl" ? "Account aanmaken" : "Create Your Account"}
                            </span> */}
            </span>
          </>
        )}
      </p>
      {!isSignIn && (
        <>
          <br />
          {/* <span>Forgot your password</span> */}
          {language.title === "nl" ? (
            <a
              target="_blank"
              href="https://janmulder.us/store/?album=Streaming"
            >
              Door u aan te melden gaat u akkoord met onze terms & conditions.
            </a>
          ) : (
            <a
              target="_blank"
              href="https://janmulder.us/store/?album=Streaming"
            >
              By Signing up, you are agree to follow our{" "}
              <span>Terms & conditions.</span>
            </a>
          )}
        </>
      )}
    </form>
  );
};

export default AuthPage;

// Sign up form: add the following checkbox (below Access Code field) that is required in order to register:
// I promise this account will only be used by me, and not to share any of the content with others.
// Dutch translation: Ik ben de exclusieve gebruiker van deze account en beloof de muziek niet te delen met derden.
// 4) Sign up form: Please link the Terms & Conditions (both English & Dutch

// I thought to already provide the Dutch translation for the text labels in the Sign up and Login screens. I hope the following format is OK (first the English, then the Dutch equivalent)
// "Sign Up", "Maak uw account aan"
// "Email", "Email"
// "Your email address", "Uw emailadres"
// "Password", "Wachtwoord"
// "Access Code", "Toegangscode"
// "Already have an account", "Heeft u al een account?" Inloggen."
// "By signing up, you are agree to follow our Terms and Conditions.", "Door u aan te melden gaat u akkoord met onze terms & conditions."
// "Login", "Inloggen"
// "Create your account", "Account aanmaken"
