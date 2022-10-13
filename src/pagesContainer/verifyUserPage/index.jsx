import { Button } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import api from "./../../../services/api";
import classes from "./VerifyUserPage.module.css";

const postSelector = (state) => state.music;

const VerifyUserPage = () => {
  const router = useRouter();

  const { language, tokenObj, user } = useSelector(postSelector, shallowEqual);

  // console.log("user", user.data.email);
  // console.log("tokenObj", tokenObj);

  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    let userData;

    if (typeof window !== "undefined") {
      // Perform localStorage action
      userData = JSON.parse(localStorage.getItem("music-app-credentials"));
    }

    // console.log("userData >>>>>>>>>", userData);

    try {
      const payload = { code: accessCode };

      // console.log("userData.data.email >>>>>>>>>>>>>>>>>", userData.data.email);

      const res = await api.patch(`/verify/${userData.data.email}`, payload);
      // console.log("data >>>>", data);

      if (res) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.removeItem("music-app-credentials");

          localStorage.setItem("type", "verify");
        }

        router.push("/success");
      }
    } catch (err) {
      setLoading(false);
      // console.error(
      //   "err.response.data.message >>>>>>>>>>",
      //   err.response.data.message
      // );
      setError(err.response.data.message);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const accessCodeTextEng = "Access Code";
  const accessCodeTextNl = "Toegangscode";

  return (
    <>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? accessCodeTextNl : accessCodeTextEng}
        </title>
      </Head>

      <form
        onSubmit={(e) => onSubmit(e)}
        className={classes.auth}
        style={{ height: "60vh" }}
      >
        <h1>
          {language.title === "nl" ? accessCodeTextNl : accessCodeTextEng}
        </h1>

        {loading && <h3>Loading..</h3>}
        {error && <h3 style={{ color: "red" }}>{error}</h3>}

        <div className={classes.input}>
          <label htmlFor="">
            {language.title === "nl" ? accessCodeTextNl : accessCodeTextEng}
          </label>
          <input
            value={accessCode}
            type="text"
            onChange={(e) => {
              setAccessCode(e.target.value);
            }}
            required
            placeholder={
              language.title === "nl"
                ? `Voer ${accessCodeTextNl}`
                : `Enter ${accessCodeTextEng}`
            }
          />
        </div>
        <Button
          // disabled={!isSignIn && !checkBox}
          type="submit"
          variant="contained"
        >
          {language.title === "nl" ? "Indienen" : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default VerifyUserPage;
