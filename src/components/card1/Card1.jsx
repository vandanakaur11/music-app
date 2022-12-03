import Image from "next/image";
import classes from "./Card1.module.css";

const Card1 = ({ title, album, url, disableFetch }) => {
  // console.log("album >>>>>>>>>>>>>>", album);
  // console.log("url >>>>>>>>>>>>>>", url);

  return (
    <>
      <div className={classes.card1}>
        <div className={classes.cardImage} style={{ width: 280, height: 280 }}>
          <Image
            src={url}
            alt={url}
            width={280}
            height={280}
            style={{ cursor: "auto" }}
          />
        </div>
        <h3>{album?.Album_Name}</h3>
      </div>
    </>
  );
};

Card1.displayName = "Card";

export default Card1;
