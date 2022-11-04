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
import PAYPALIMAGE from "./../../../public/images/pay_pal.svg";
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
  // console.log("Auth SubscriptionsPage >>>>>>>>");

  const { language } = useSelector(postSelector, shallowEqual);

  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState(null);
  

  const fetchSubscriptions = async () => {
    try {
      const { data } = await api.get("/admin/subscriptions");

      // console.log("data >>>>>>>>>>", data.data.subscriptions);

      if (data) {
        const allSubscriptionsExceptOne = data?.data?.subscriptions.filter(
          (subscription) => subscription.code !== "PREMIUM"
        );

        // console.log("allSubscriptionsExceptOne", allSubscriptionsExceptOne);

        setSubscriptions(allSubscriptionsExceptOne);
        // setSubscriptions(data.data.subscriptions);
      }
    } catch (err) {
      console.error("err >>>>>>>>", err);
    }
  };

  // console.log("subscriptions >>>>>>>>>>", subscriptions);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // console.log("ALBUMIMAGE >>>>>>", ALBUMIMAGE);
  // console.log("MELODYIMAGE >>>>>>", MELODYIMAGE);
  // console.log("PRICEIMAGE >>>>>>", PRICEIMAGE);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [paypalURL, setPaypalURL] = useState("");

  const handleClick = async (price, subscriptionId) => {
    // console.log("price >>>>>>>>>>>", price);
    setLoading(true);

    if (price === "0") {
      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.setItem("sub", subscriptionId); // subscriptionID
      }

      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.removeItem("offerType");
      }

      setLoading(false);

      setTimeout(() => {
        router.push("/signup");
      }, 3000);
    } else {
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
        const { data } = await api.get(`/api/pay?price=${price}`);
        // console.log("data >>>>>>>>>>>", data);

        if (data) {
          setPaypalURL(data.link);
          setLoading(false);
        }
      } catch (err) {
        console.error("err >>>>>>>>>>>", err);
      }
    }
  };

  return (
    <div className={styles.card_container}>
      <Head>
        <title>
          Mulder Music Streaming |{" "}
          {language.title === "nl" ? "Abonnement" : "Subscription"}
        </title>
      </Head>

      <h1>{language.title === "nl" ? "Abonnement" : "Subscription"}</h1>

      {/* <Typography
        my={"1rem"}
        color="#ffffff"
        gutterBottom
        variant="h2"
        component="h1"
      >
        Coming Soon...
      </Typography> */}

      {/* Subscription */}

      <div className={styles.cards}>
        {subscriptions?.length > 0 ? (
          subscriptions?.map((subscription, index) => (
            <div className={styles.card} key={index}>
              <h1>Offer {index + 1}</h1>

              <h2>
                <span>
                  Valid: ({subscription.duration}{" "}
                  {subscription.duration > 1 ? "Days" : "Day"})
                </span>
                <span>Price: {subscription.price}</span>
              </h2>

              <div className={styles.list}>
                {subscription?.songDetail?.map((songDetail, index) => (
                  <details key={index} className={styles.warning}>
                    <summary>{songDetail.album}</summary>
                    {songDetail?.songs?.map((song, index) => (
                      <p key={index}>{song.Song_Name}</p>
                    ))}
                  </details>
                ))}
              </div>

              <Button
                className={styles.avail_btn}
                size="small"
                onClick={() =>
                  handleClick(subscription.price, subscription._id)
                }
              >
                {language.title === "nl" ? "Beschikbaar" : "Avail"}
              </Button>
            </div>
          ))
        ) : (
          <div className={styles.loading}>
            <h1 >Loading...</h1>
          </div>
        )}
      </div>

      <div className={styles.modal}>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          {loading || loader ? (
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
              <form action={`${paypalURL}`} method="post">
                <Button type="submit">
                  <Image src={PAYPALIMAGE} width="100%" height="30px" />
                </Button>
              </form>
            </Box>
          )}
        </Modal>
      </div>

      {/* End Subscription */}

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
              <form action={paypalURL} method="post" onSubmit={handleSubmit}>
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
