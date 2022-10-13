import { Button, FormControlLabel } from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/musicReducer";
import api from "./../../../services/api";
import styles from "./Signup.module.css";

const postSelector = (state) => state.music;

const SignupPage = () => {
  console.log("Auth SignupPage >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();

  const dispatch = useDispatch();

  /* let payerEmail = "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      localStorage.setItem("payer_email", payerEmail);
    }
  }, []);

  const [email, setEmail] = useState(payerEmail !== "" ? payerEmail : null); */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkBox, setCheckBox] = useState(false);

  // console.log({ email, accessCode });
  // console.log(router.query.email ? router.query.email : "", router.query.access_code ? router.query.access_code : "");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      // let payload;
      // if (payerEmail !== "") {
      //   let endDate;

      //   if (price === "200.0") endDate = new Date.now() * 1000;

      //   payload = {
      //     email,
      //     password,
      //     subscriptionPlan: {
      //       code: "LDTRIAL1",
      //       type: "Offer 1",
      //       price: "200.0",
      //       endDate,
      //     },
      //   };
      // } else {
      let payload = { email, password, code };
      // }

      // console.log("payload >>>>>>>>>", payload);

      const { data } = await api.post("/signup", payload);

      // console.log("data >>>>>>>>", data);

      if (data) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.setItem("music-app-credentials", JSON.stringify(data));

          localStorage.setItem("type", "signup");
        }

        dispatch(setUser(data));

        setLoading(false);

        router.push("/");
      }
    } catch (err) {
      setLoading(false);

      // console.error("err.response.data.message >>>>>>>>>>", err.response.data);

      setError(err.response.data);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const signupTextEng = "Sign Up";
  const signupTextNl = "Aanmelden";

  const codePromiseText =
    language.title === "nl"
      ? "Ik beloof dat dit account alleen door mij zal worden gebruikt en niet om de inhoud met anderen te delen."
      : "I promise this account will only be used by me, and not to share any of the content with others.";

  return (
    <form onSubmit={handleSubmit} className={styles.auth}>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? signupTextNl : signupTextEng}
        </title>
      </Head>

      <h1>{language.title === "nl" ? signupTextNl : signupTextEng}</h1>

      {loading && <h3>Loading..</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div className={styles.input}>
        <label>{language.title === "nl" ? "E-mail" : "Email"}</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          // disabled={payerEmail !== "" ? true : false}
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

      <div className={styles.input}>
        <label>{language.title === "nl" ? "Wachtwoord" : "Password"}</label>
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

      <div className={styles.input}>
        <label>
          {language.title === "nl" ? "Toegangscode" : "Access Code"}
        </label>
        <input
          value={code}
          type="text"
          onChange={(e) => {
            setCode(e.target.value);
          }}
          required
          placeholder={
            language.title === "nl"
              ? "Voer toegangscode in"
              : "Enter Access Code"
          }
        />
      </div>

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

      <Button type="submit" variant="contained">
        {language.title === "nl" ? signupTextNl : signupTextEng}
      </Button>

      <br />

      <p>
        <span onClick={() => router.push("/login")}>
          {language.title === "nl"
            ? "Heb je al een account? Nu inloggen"
            : "Already have an account? Now Login"}
        </span>
      </p>
      <br />
      <a target="_blank" href="https://janmulder.us/store/?album=Streaming">
        {language.title === "nl"
          ? "Door je aan te melden, ga je akkoord met onze algemene voorwaarden."
          : "By Signing up, you are agree to follow our terms & conditions."}
      </a>
    </form>
  );
};

export default SignupPage;

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
