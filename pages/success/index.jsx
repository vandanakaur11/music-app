import { useRouter } from "next/router";
import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Footer from "./../../src/components/footer";
import styles from "./../../src/pagesContainer/loginPage/LoginPage.module.css";

const index = () => {
  const router = useRouter();

  let type;

  if (typeof window !== "undefined") {
    // Perform localStorage action
    type = localStorage.getItem("type");
  }

  useEffect(() => {
    setTimeout(() => {
      type === "signup"
        ? router.push("/verify")
        : type === "verify" ||
          type === "reset" ||
          type === "premium-subscription"
        ? router.push("/login")
        : null;

      if (typeof window !== "undefined") {
        // Perform localStorage action
        localStorage.removeItem("type");
      }
    }, 3000);
  }, []);

  return (
    <>
      <div
        style={{
          justifyContent: "center",
          textAlign: "center",
          padding: "10rem",
        }}
        className={styles.auth}
      >
        {type === "signup" ? (
          <h3>
            Your Account has been successfully created Please check your email
            for access code
          </h3>
        ) : type === "verify" ? (
          <h3>Account verified successfully, You can now log in....</h3>
        ) : type === "premium-subscription" ? (
          <h3>
            Your subscription has been upgraded successfully for one year...
          </h3>
        ) : (
          <h3>Password updated successfully. You can now log in....</h3>
        )}
        <span>
          <ClipLoader color="#ffffff" />
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Footer />
      </div>
    </>
  );
};

export default index;
