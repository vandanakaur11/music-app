import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";
import classes from "./LyricsModal.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#E9D8B0",
  // border: "2px solid red",
  boxShadow: 24,
  p: 4,
};

export default function LyricsModal({
  setOpen,
  open,
  handleClose,
  handleOpen,
  lyrics,
}) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  // console.log("llllllllll", lyrics)

  const lyricsInString = JSON.stringify(lyrics);
  // console.log("lyricsInString >>>>>>>>>>>", lyricsInString);

  // console.log(
  //   `lyricsInString.split("\\n") >>>>>>>>>>`,
  //   lyricsInString.split("\\n")
  // );

  // console.log(
  //   "lyricsBrakeByBackSlahN[0] >>>>>>>",
  //   lyricsBrakeByBackSlahN[0].replace(`"`, "")
  // );

  const lyricsBrakeByBackSlahN = lyricsInString
    .replace(/"/g, "")
    .split("\\r\\n");
  // console.log("lyricsBrakeByBackSlahN >>>>>>>>>>", lyricsBrakeByBackSlahN);

  return (
    <div className={classes.lyrics_modal}>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // hideBackdrop={true}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              color: "black",
              textAlign: "center",
              fontWeight: "bold",
              position: "relative",
            }}
          >
            LYRICS
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ color: "black", fontFamily: "cursive" }}
          >
            {/* {lyrics} */}
            {lyricsBrakeByBackSlahN.map((text, index) => (
              <p key={index} style={{ color: "unset", textAlign: "justify" }}>
                {text}
              </p>
            ))}
          </Typography>
          <span className={classes.cross_sign} onClick={handleClose}>
            X
          </span>
        </Box>
      </Modal>
    </div>
  );
}
