import { Button } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import api from "../../../services/api";
import classes from "./VerifyPremiumCode.module.css";

const postSelector = (state) => state.music;

const VerifyPremiumCode = () => {
  // console.log("VerifyPremiumCode >>>>>>>>");

  const { language, user } = useSelector(postSelector, shallowEqual);

  // console.log("user===>", user);

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [premiumCode, setPremiumCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      setEmail(localStorage.getItem("verifyUserEmail"));
    }
  }, []);

  // console.log({ email, resetPasswordVerificationCode });
  // console.log(router.query.email ? router.query.email : "", router.query.access_code ? router.query.access_code : "");

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    try {
      // add next day base on duration day
      const endDate = new Date();

      endDate.setDate(new Date().getDate() + 365);

      // console.log("endDate >>>>>>>>", endDate.toISOString());

      // setSubscriptionEndDate(endDate.toISOString());

      const body = {
        code: premiumCode,
        subscriptionID: "635bd8fdcb397b3a044d9867",
        subscriptionEndDate: endDate.toISOString(),
      };

      let { data } = await api.patch(`/api/premium-code/${email}`, body);

      // console.log("data >>>>>>>>>>>>>", data);

      if (data) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.removeItem("verifyUserEmail");

          localStorage.setItem("type", "premium-subscription");
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

      setError(err?.response?.data?.message);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  

  return (
    <form onSubmit={handleSubmit} className={classes.auth}>
      <Head>
        <title>Mulder Music Streaming | </title>
      </Head>

      <h1>{language.title === "nl" ? "Premium-code" : "Premium Code"}</h1>

      {/* {loading && <h3>Loading..</h3>} */}
      {loading && (
        <div className={classes.loading}>
          <h1 style={{ fontSize: "2.5rem" }}>Loading...</h1>
        </div>
      )}

      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div className={classes.input}>
        <label htmlFor="">
          {language.title === "nl" ? "Premium-code" : "Premium Code"}
        </label>
        <input
          // disabled={!isSignIn ? true : false}
          type="text"
          onChange={(e) => {
            setPremiumCode(e.target.value);
          }}
          value={premiumCode}
          required
          minLength={7}
          maxLength={10}
          placeholder={
            language.title === "nl"
              ? "Voer Premium-code in"
              : "Enter Premium Code"
          }
        />
      </div>
      <Button type="submit" variant="contained">
        {language.title === "nl" ? "Indienen" : "Submit"}
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

export default VerifyPremiumCode;
