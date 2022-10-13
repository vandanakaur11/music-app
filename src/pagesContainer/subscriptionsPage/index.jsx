import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ALBUMIMAGE from "./../../../public/images/album.png";
import MELODYIMAGE from "./../../../public/images/melody.png";
import PAYPALIMAGE from "./../../../public/images/pay_pal.svg";
import PRICEIMAGE from "./../../../public/images/price.png";
import api from "./../../../services/api";
import Cliploader from "react-spinners/ClipLoader";
import styles from "./Subscriptions.module.css";

const postSelector = (state) => state.music;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const SubscriptionsPage = () => {
  console.log("Auth SubscriptionsPage >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();

  // console.log("ALBUMIMAGE >>>>>>", ALBUMIMAGE);
  // console.log("MELODYIMAGE >>>>>>", MELODYIMAGE);
  // console.log("PRICEIMAGE >>>>>>", PRICEIMAGE);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [sandBoxURL, setSandBoxURL] = useState("");

  const handleClick = async (price) => {
    setLoading(true);

    if (typeof window !== "undefined") {
      // Perform localStorage action
      localStorage.removeItem("offerType");
    }

    setOpen(true);
    setPrice(price);

    if (typeof window !== "undefined") {
      // Perform localStorage action
      localStorage.setItem("offerType", price);
    }

    try {
      const { data } = await api.get(`/pay?price=${price}`);
      console.log("data >>>>>>>>>>>", data);

      if (data) {
        setSandBoxURL(data.link);
        setLoading(false);
      }
    } catch (err) {
      console.error("err >>>>>>>>>>>", err);
    }
  };

  /* const stopWatch = () => {
    let future = Date.parse("sep 25, 2022 00:00:00");
    let now = new Date();
    let diff = future - now;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let mins = Math.floor(diff / (1000 * 60));
    let secs = Math.floor(diff / 1000);

    let d = days;
    let h = hours - days * 24;
    let m = mins - hours * 60;
    let s = secs - mins * 60;

    document.getElementById("timer").innerHTML =
      "<div>" +
      d +
      "<span>Days</span></div>" +
      "<div>" +
      h +
      "<span>Hours</span></div>" +
      "<div>" +
      m +
      "<span>Minutes</span></div>" +
      "<div>" +
      s +
      "<span>Seconds</span></div>";
  };

  useEffect(() => {
    setInterval(() => {
      stopWatch();
    }, 1000);
  }, []); */

  return (
    <div className={styles.card_container}>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? "Abonnement" : "Subscription"}
        </title>
      </Head>

      {/* <h1>{language.title === "nl" ? "Abonnement" : "Subscription"}</h1> */}

      <Typography
        my={"1rem"}
        color="#ffffff"
        gutterBottom
        variant="h2"
        component="h1"
      >
        Coming Soon...
      </Typography>

      {/* <div id="timer"></div> */}

      {/* <div className={styles.card}>
        <Card
          sx={{ width: "15rem", marginTop: "2rem", backgroundColor: "#CCB488" }}
        >
          <CardContent>
            <Typography
              color="#382b11"
              gutterBottom
              variant="h5"
              component="div"
            >
              Offer 1
            </Typography>
            <Box className={styles.description} mt="2rem">
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary">
                  <Image src={ALBUMIMAGE} width={30} height={30} />
                  <span>{language.title === "nl" ? "Albums" : "Albums"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1
                </Typography>
              </Box>
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary" my="1rem">
                  <Image src={MELODYIMAGE} width={28} height={28} />
                  <span>{language.title === "nl" ? "Liedjes" : "Songs"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  4
                </Typography>
              </Box>
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary">
                  <Image src={PRICEIMAGE} width={30} height={30} />
                  <span>{language.title === "nl" ? "Prijs" : "Price"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $200
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions className={styles.btn_container}>
            <Button
              className={styles.avail_btn}
              size="small"
              onClick={() => handleClick(200)}
            >
              {language.title === "nl" ? "Beschikbaar" : "Avail"}
            </Button>
          </CardActions>
        </Card>
        <Card
          sx={{ width: "15rem", marginTop: "2rem", backgroundColor: "#CCB488" }}
        >
          <CardContent>
            <Typography
              color="#382b11"
              gutterBottom
              variant="h5"
              component="div"
            >
              Offer 2
            </Typography>
            <Box className={styles.description} mt="2rem">
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary">
                  <Image src={ALBUMIMAGE} width={30} height={30} />
                  <span>{language.title === "nl" ? "Albums" : "Albums"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2
                </Typography>
              </Box>
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary" my="1rem">
                  <Image src={MELODYIMAGE} width={28} height={28} />
                  <span>{language.title === "nl" ? "Liedjes" : "Songs"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  6
                </Typography>
              </Box>
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary">
                  <Image src={PRICEIMAGE} width={30} height={30} />
                  <span>{language.title === "nl" ? "Prijs" : "Price"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $300
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions className={styles.btn_container}>
            <Button
              className={styles.avail_btn}
              size="small"
              onClick={() => handleClick(300)}
            >
              {language.title === "nl" ? "Beschikbaar" : "Avail"}
            </Button>
          </CardActions>
        </Card>
        <Card
          sx={{ width: "15rem", marginTop: "2rem", backgroundColor: "#CCB488" }}
        >
          <CardContent>
            <Typography
              color="#382b11"
              gutterBottom
              variant="h5"
              component="div"
            >
              Offer 3
            </Typography>
            <Box className={styles.description} mt="2rem">
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary">
                  <Image src={ALBUMIMAGE} width={30} height={30} />
                  <span>{language.title === "nl" ? "Albums" : "Albums"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3
                </Typography>
              </Box>
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary" my="1rem">
                  <Image src={MELODYIMAGE} width={28} height={28} />
                  <span>{language.title === "nl" ? "Liedjes" : "Songs"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  8
                </Typography>
              </Box>
              <Box className={styles.text}>
                <Typography variant="body2" color="text.secondary">
                  <Image src={PRICEIMAGE} width={30} height={30} />
                  <span>{language.title === "nl" ? "Prijs" : "Price"}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $400
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions className={styles.btn_container}>
            <Button
              className={styles.avail_btn}
              size="small"
              onClick={() => handleClick(400)}
            >
              {language.title === "nl" ? "Beschikbaar" : "Avail"}
            </Button>
          </CardActions>
        </Card>
      </div>

      <div className={styles.modal}>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          {loading ? (
            <div className={styles.loading_div}>
              <h1>Loading...</h1>
            </div>
          ) : (
            <Box sx={style} className={styles.modal_container}>
              <Typography
                variant="h5"
                color="#000000"
                textAlign="center"
                mb={2}
              >
                {language.title === "nl"
                  ? "Betaling via PayPal"
                  : "Payment via PayPal"}
              </Typography>
              <form action={sandBoxURL} method="post" onSubmit={handleSubmit}>
                <Button type="submit">
                  <Image src={PAYPALIMAGE} width="100%" height="30px" />
                </Button>
              </form>
            </Box>
          )}
        </Modal>
      </div> */}
    </div>
  );
};

export default SubscriptionsPage;
