import { Button } from "@material-ui/core";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/musicReducer";
import classes from "./AccessCodePage.module.css";

const postSelector = (state) => state.music;

const AccessCodePage = () => {
  console.log("Auth LoginPage >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // console.log({ email, accessCode });
  // console.log(router.query.email ? router.query.email : "", router.query.access_code ? router.query.access_code : "");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const payload = { email, password };

    const url = `${process.env.base_url}/signin`;

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
  };

  const loginTextEng = "Access Code";
  const loginTextNl = "Submit";

  return (
    <form onSubmit={handleSubmit} className={classes.auth}>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? loginTextNl : loginTextEng}{" "}
        </title>
      </Head>

      <h1>{language.title === "nl" ? loginTextNl : loginTextEng}</h1>

      {loading && <h3>Loading..</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div className={classes.input}>
        <label htmlFor="">
          {language.title === "nl" ? "Wachtwoord" : "Access Code"}
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
            language.title === "nl" ? "Wachtwoord" : "Enter Access Code"
          }
        />
      </div>
      <Button
        // disabled={!isSignIn && !checkBox}
        type="submit"
        variant="contained"
      >
        {language.title === "nl" ? loginTextNl : loginTextNl}
      </Button>
      <br />
      {/* <p>
                <span
                    onClick={() => {
                        setPassword("");
                        router.push("/forgot");
                    }}
                >
                    {language.title === "nl" ? "Wachtwoord vergeten?" : "Back to Login"}
                </span>
            </p> */}
    </form>
  );
};

export default AccessCodePage;
