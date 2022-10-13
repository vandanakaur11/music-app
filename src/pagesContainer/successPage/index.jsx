import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import api from "./../../../services/api";
import styles from "./../signupPage/Signup.module.css";

const postSelector = (state) => state.music;

const SuccessPage = () => {
  console.log("Auth SuccessPage >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const [error, setError] = useState("");

  const router = useRouter();

  console.log("router.query >>>>>>>>>>>>>", router.query);

  const { paymentId, PayerID } = router.query;

  const apiRequest = async () => {
    try {
      const { data } = await api.get(
        `/success?paymentId=${paymentId}&PayerID=${PayerID}`
      );

      // console.log("data >>>>>>>>>>>>>", data);

      if (data) {
        const { email } = data.payer.payer_info;

        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.setItem("payer_email", email);
        }

        setTimeout(() => {
          router.push("/signup");
        }, 5000);
      }
    } catch (err) {
      setError(err?.response?.data);

      // console.log("err?.response?.data >>>>>>>>>>>", err?.response?.data);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    apiRequest();
  }, []);

  return (
    <div
      style={{
        justifyContent: "center",
        textAlign: "center",
        padding: "10.5rem",
      }}
      className={styles.auth}
    >
      <h3>
        {error && <h3 style={{ color: "red" }}>{error}</h3>}
        {paymentId && PayerID && language.title === "nl"
          ? "Bedankt voor het abonneren. Even geduld aub..."
          : "Thanks for subscribing. Please wait..."}
      </h3>
      <span>
        <ClipLoader color="#ffffff" />
      </span>
    </div>
  );
};

export default SuccessPage;
