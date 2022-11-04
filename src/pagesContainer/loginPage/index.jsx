import { Button } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/musicReducer";
import api from "./../../../services/api";
import classes from "./LoginPage.module.css";

const postSelector = (state) => state.music;

const LoginPage = () => {
  // console.log("Auth LoginPage >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      setMessage(localStorage.getItem("success"));

      setTimeout(() => {
        localStorage.removeItem("success");

        setMessage("");
      }, 5000);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      const userData = localStorage.getItem("music-app-credentials");

      if (userData) {
        router.replace("/");
      }
    }
  }, []);

  // console.log({ email, accessCode });
  // console.log(router.query.email ? router.query.email : "", router.query.access_code ? router.query.access_code : "");

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    const payload = { email, password };

    // console.log("payload >>>>>>>>>>>", payload);

    try {
      const { data } = await api.post("/api/signin", payload);

      // console.log("data >>>>>>>>>>>", data);

      // console.log("Login Data >>>>>>>>>>>", data);

      // router.replace("/login", "/");

      if (typeof window !== "undefined") {
        // Perform localStorage action
        // localStorage.setItem("music-app-credentials", JSON.stringify(data));
        localStorage.setItem("music-app-credentials", JSON.stringify(data));
      }

      dispatch(setUser(data));

      setLoading(false);

      router.replace("/");
    } catch (err) {
      setLoading(false);

      console.error(
        "err.response.data.message >>>>>>>>>>",
        err.response.data.message
      );

      setError(err.response.data.message);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const loginTextEng = "Login";
  const loginTextNl = "Log in";

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={classes.auth}>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? loginTextNl : loginTextEng}{" "}
        </title>
      </Head>

      {message && (
        <h1 style={{ color: "white", fontSize: "30px", margin: "20px 0" }}>
          {message}
        </h1>
      )}

      <h1>{language.title === "nl" ? loginTextNl : loginTextEng}</h1>

      {loading && <h3>Loading..</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div className={classes.input}>
        <label htmlFor="">{language.title === "nl" ? "E-mail" : "Email"}</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          // disabled={!isSignIn ? true : false}
          type="email"
          required
          placeholder={
            language.title === "nl"
              ? "Vul email adres in"
              : "Enter Email Address"
          }
        />
      </div>
      {/* Email */}
      {/* Disable conditions on the basis of /signup and /signup?uduiwe */}

      <div className={classes.input}>
        <label htmlFor="">
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
            language.title === "nl" ? "Voer wachtwoord in" : "Enter Password"
          }
        />
      </div>
      <div className={classes.login_btn_div}>
        {loading ? (
          <Button
            // disabled={!isSignIn && !checkBox}
            disabled={true}
            type="submit"
            // variant="contained"
            // style={{ opacity: "0.9" }}
          >
            Loading...
          </Button>
        ) : (
          <Button type="submit" variant="contained">
            {language.title === "nl" ? loginTextNl : loginTextEng}
          </Button>
        )}
        <br />
        <p className={classes.forgot_p_tag}>
          <span
            onClick={() => {
              router.push("/subscriptions");
            }}
          >
            {language.title === "nl"
              ? "Koop een abonnement"
              : "Buy a Subscription"}
          </span>
          <span
            onClick={() => {
              router.push("/premium-code");
            }}
          >
            {language.title === "nl"
              ? "Ik Heb Premium Code"
              : "I've Premium Code"}
          </span>
          <span
            onClick={() => {
              router.push("/forgot");
            }}
          >
            {language.title === "nl"
              ? "Wachtwoord vergeten"
              : "Forgot Password"}
            ?
          </span>
        </p>
      </div>
      {/* <p>
        <span
          onClick={() => {
            router.push("/signup");
          }}
        >
          {language.title === "nl"
            ? "Geen account! Nieuwe aanmaken"
            : "No Account! Create new one"}
        </span>
      </p> */}
    </form>
  );
};

export default LoginPage;

// Sign up form: add the following checkbox (below Access Code field) that is required in order to register:
// I promise this account will only be used by me, and not to share any of the content with others.
// Dutch translation: Ik ben de exclusieve gebruiker van deze account en beloof de muziek niet te delen met derden.
// 4) Sign up form: Please link the Terms & Conditions (both English & Dutch

// I thought to already provide the Dutch translation for the text labels in the Sign up and Login screens. I hope the following format is OK (first the English, then the Dutch equivalent)
// "Sign Up", "Aanmelden"
// "Email", "Email"
// "Your email address", "Uw emailadres"
// "Password", "Wachtwoord"
// "Access Code", "Toegangscode"
// "Already have an account", "Heeft u al een account?" Inloggen."
// "By signing up, you are agree to follow our Terms and Conditions.", "Door u aan te melden gaat u akkoord met onze terms & conditions."
// "Login", "Log in"
// "Create your account", "Account aanmaken"
