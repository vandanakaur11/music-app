import { Button } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import api from "./../../../services/api";
import classes from "./PremiumCode.module.css";

const postSelector = (state) => state.music;

const PremiumCode = () => {
  // console.log("PremiumCode >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [premiumCode, setPremiumCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    try {
      let { data } = await api.get(`/api/find-account/${email}`);

      // console.log("api response data >>>>>>>>>>>", data);
      // console.log("api response data?.data >>>>>>>>>>>", data?.data);
      // console.log(
      //   "api response data?.data?.user?.email >>>>>>>>>>>",
      //   data?.data?.user?.email
      // );

      if (data) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.setItem("verifyUserEmail", data?.data?.user?.email);
        }

        setLoading(false);

        router.push("/premium-code/verify");
      }
    } catch (err) {
      setLoading(false);

      console.error(
        "err?.response?.data?.message >>>>>>>>>>",
        err?.response?.data?.message
      );

      setError(err?.response?.data?.message);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} className={classes.auth}>
        <Head>
          <title>
            Mulder Music Streaming |{" "}
            {language.title === "nl" ? "Premium-code" : "Premium Code"}
          </title>
        </Head>

        <h1>
          {language.title === "nl" ? "Vind Je Account" : "Find Your Account"}
        </h1>

        {/* {loading && <h3>Loading..</h3>} */}
        {loading && (
          <div className={classes.loading}>
            <h1 style={{ fontSize: "2.5rem" }}>Loading...</h1>
          </div>
        )}

        {error && <h3 style={{ color: "red" }}>{error}</h3>}

        <div className={classes.input}>
          <label htmlFor="">
            {language.title === "nl" ? "E-mail" : "Email"}
          </label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            // disabled={loading ? true : false}
            type="email"
            required
            placeholder={
              language.title === "nl"
                ? "Vul email adres in"
                : "Enter Email Address"
            }
          />
        </div>
        <Button type="submit" variant="contained">
          {language.title === "nl" ? "Gevonden" : "Found"}
        </Button>
        <br />
        <p>
          <span className={classes.linkBoxWrapper}>
            <span
              onClick={() => {
                router.push("/login");
              }}
            >
              {language.title === "nl"
                ? "Terug naar Inloggen"
                : "Back to Login"}
            </span>
          </span>
        </p>
      </form>
    </>
  );
};

export default PremiumCode;
