import { Button } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import api from "./../../../services/api";
import classes from "./ResetPassword.module.css";

const postSelector = (state) => state.music;

const ResetPassword = () => {
  console.log("ResetPassword >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();
  const dispatch = useDispatch();

  const [resetPasswordVerificationCode, setResetPasswordVerificationCode] =
    useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // console.log({ email, resetPasswordVerificationCode });
  // console.log(router.query.email ? router.query.email : "", router.query.access_code ? router.query.access_code : "");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const body = {
        resetPasswordVerificationCode,
        password,
      };

      let userID;

      if (typeof window !== "undefined") {
        // Perform localStorage action
        userID = localStorage.getItem("userID");
      }

      let res = await api.patch(`/reset-password/${userID}`, body);

      // console.log("reset password>>>>>>>>>>>>>", res);

      if (res) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.removeItem("userID");

          localStorage.setItem("type", "reset");
        }

        setLoading(false);

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

    // const payload = { email, password, code: resetPasswordVerificationCode };

    // const url = `${process.env.base_url}/updatePassword`;

    // try {
    //   const { data } = await axios.post(url, payload);

    //   console.log(data);

    //   setLoading(false);

    //   localStorage.setItem("music-app-credentials", JSON.stringify(data));
    //   dispatch(setUser(data));

    // } catch (err) {
    //   setLoading(false);
    //   console.log({ err });
    //   setError(err?.response?.data);

    //   setTimeout(() => {
    //     setError("");
    //   }, 3000);
    // }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.auth}>
      <Head>
        <title>Mulder Music Streaming | </title>
      </Head>

      <h1>
        {language.title === "nl"
          ? "Wachtwoord opnieuw instellen"
          : "Reset Password"}
      </h1>

      {loading && <h3>Loading..</h3>}

      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div className={classes.input}>
        <label htmlFor="">
          {language.title === "nl" ? "Verificatie code" : "Verification Code"}
        </label>
        <input
          // disabled={!isSignIn ? true : false}
          type="text"
          onChange={(e) => {
            setResetPasswordVerificationCode(e.target.value);
          }}
          value={resetPasswordVerificationCode}
          required
          minLength={7}
          maxLength={10}
          placeholder={
            language.title === "nl" ? "Verificatie code" : "Verification Code"
          }
        />
      </div>

      <div className={classes.input}>
        <label htmlFor="">
          {language.title === "nl" ? "Wachtwoord" : "Password"}
        </label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          required
          minLength={6}
          maxLength={36}
          placeholder={
            language.title === "nl" ? "Nieuw Wachtwoord" : "Your New Password"
          }
        />
      </div>

      <Button type="submit" variant="contained">
        {language.title === "nl" ? "Indienen" : "Submit"}
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: "44vw",
            left: "44vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <ClipLoader color="red" loading={loading} size={"10vw"} />
        </div>
      </Button>

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
        <ClipLoader color="red" loading={loading} size={"10vw"} />
      </div>
      <br />
    </form>
  );
};

export default ResetPassword;
