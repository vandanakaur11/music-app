import { Typography } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import classes from "./VerifyUserPage.module.css";

const postSelector = (state) => state.music;

const VerifyUserPage = () => {
  const router = useRouter();

  const { language, user } = useSelector(postSelector, shallowEqual);

  const successTextEng = "Check your email for verification";
  const successTextNl = "Controleer uw e-mail voor verificatie";

  useEffect(() => {
    if (user) {
      router.replace("/");
    } else {
      router.replace("/verify");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? successTextNl : successTextEng}
        </title>
      </Head>

      <div className={classes.auth}>
        <Typography variant="h4">
          {language.title === "nl" ? successTextNl : successTextEng}
        </Typography>
      </div>
    </>
  );
};

export default VerifyUserPage;
