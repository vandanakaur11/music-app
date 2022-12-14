import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setSong, setSongs, setUser } from "../../store/musicReducer";
import api from "./../../../services/api";
import styles from "./ExtendSubscription.module.css";

const postSelector = (state) => state.music;

const ExtendSubscription = () => {
  // console.log("ExtendSubscription >>>>>>>>");

  const router = useRouter();

  const { language, user } = useSelector(postSelector, shallowEqual);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // console.log("user >>>>>>>>", user);

    if (typeof window !== "undefined") {
      // Perform localStorage action
      if (user) {
        router.replace("/");
      } else if (!localStorage.getItem("trial-info")) {
        router.replace("/");
      } else if (!user && !localStorage.getItem("trial-info")) {
        dispatch(setSong({}));
        dispatch(setSongs([]));
        dispatch(setUser(null));

        localStorage.removeItem("songArray");
        localStorage.removeItem("Expiring-Days-Api");
        localStorage.removeItem("subscriptionSongDetails");
        localStorage.removeItem("music-app-credentials");

        router.replace("/login");
      }
    }

    let trialInfo = {};

    if (typeof window !== "undefined") {
      // Perform localStorage action
      trialInfo = JSON.parse(localStorage.getItem("trial-info"));

      setEmail(trialInfo?.email);

      setError(trialInfo?.message);

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("clicked");
    // console.log("email >>>>>>>>>>", email);

    setLoading(true);

    try {
      const body = {
        code,
      };

      let { data } = await api.patch(`/api/extend-subscription/${email}`, body);

      // console.log("data >>>>>>>>>>>>>", data);

      if (data) {
        if (typeof window !== "undefined") {
          // Perform localStorage action
          localStorage.removeItem("trial-info");

          localStorage.setItem("type", "premium-subscription");
        }

        setLoading(false);

        router.push("/success");
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

  const handleNavigation = () => {
    localStorage.removeItem("trial-info");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <form
        autoComplete="off"
        className={styles.auth}
        onSubmit={(e) => handleSubmit(e)}
      >
        {error && <h3 className={styles.error}>{error}</h3>}

        <h1>
          {language.title === "nl"
            ? "Abonnement verlengen"
            : "Extend Subscription"}
        </h1>
        <span>
          {language.title === "nl"
            ? "Optie 1: Voer de gekochte toegangscode in"
            : "Option 1: Enter Purchased Access Code"}
        </span>
        <p>
          {language.title === "nl"
            ? "U kunt een nieuwe toegangscode kopen op"
            : "You can purchase a new access code on"}{" "}
          <a href="https://www.ianmulder.us">www.ianmulder.us</a>
          {language.title === "nl"
            ? "en gebruik het om uw abonnement met 12 maanden te verlengen."
            : "and use it to extend your subscription 12 months."}
        </p>
        <div className={`${styles.inputContainer}`}>
          <input
            type="text"
            name="code"
            placeholder={
              language.title === "nl"
                ? "Voer toegangscode in"
                : "Enter Access Code"
            }
            onChange={(e) => {
              setCode(e.target.value);
            }}
            value={code}
            required
            minLength={7}
            maxLength={10}
          />
          <button type="submit">
            {language.title === "nl" ? "Indienen" : "Submit"}
          </button>
        </div>
        <hr />
        <span>
          {language.title === "nl"
            ? "Optie 2: Betaal via PayPal"
            : "Option 2: Pay via PayPal"}
        </span>
        <strong>$23.99</strong>
        <button>
          <i>Pay</i> <span>Pal</span>
        </button>
        <p style={{ margin: "1rem 0", fontSize: "1rem" }}>
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => handleNavigation()}
          >
            {language.title === "nl" ? "Terug naar Inloggen" : "Back to Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default ExtendSubscription;
