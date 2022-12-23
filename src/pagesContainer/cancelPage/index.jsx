import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./../signupPage/Signup.module.css";

const postSelector = (state) => state.music;

const SuccessPage = () => {
  // console.log("Auth SuccessPage >>>>>>>>");

  const router = useRouter();

  const { language } = useSelector(postSelector, shallowEqual);

  useEffect(() => {
    setTimeout(() => {
      router.push("/subscriptions");
    }, 5000);
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
      <h3 style={{ color: "red" }}>
        {language.title === "nl"
          ? "Je abonnement is opgezegd!"
          : "Your subscription cancelled!, Try again..."}
      </h3>
      <span>
        <ClipLoader color="#ffffff" />
      </span>
    </div>
  );
};

export default SuccessPage;
