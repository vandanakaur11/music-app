// import { withStyles } from "@material-ui/styles";
// import { Box, Modal, Typography } from "@mui/material";
// import * as React from "react";
// import classes from "./LyricsModal.module.css";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "#E9D8B0",
//   // border: "2px solid red",
//   boxShadow: 24,
//   p: 4,
// };

// const modalStyle = {
//   maxHeight: "90vh",
//   minHeight: "90vh",
// };

// // export default function LyricsModal({
// const LyricsModal = ({ setOpen, open, handleClose, handleOpen, lyrics }) => {
//   // const [open, setOpen] = React.useState(false);
//   // const handleOpen = () => setOpen(true);
//   // const handleClose = () => setOpen(false);
//   // console.log("llllllllll", lyrics)

//   const lyricsInString = JSON.stringify(lyrics);
//   // console.log("lyricsInString >>>>>>>>>>>", lyricsInString);

//   // console.log(
//   //   `lyricsInString.split("\\n") >>>>>>>>>>`,
//   //   lyricsInString.split("\\n")
//   // );

//   // console.log(
//   //   "lyricsBrakeByBackSlahN[0] >>>>>>>",
//   //   lyricsBrakeByBackSlahN[0].replace(`"`, "")
//   // );

//   const lyricsBrakeByBackSlahN = lyricsInString
//     .replace(/"/g, "")
//     .split("\\r\\n");
//   // console.log("lyricsBrakeByBackSlahN >>>>>>>>>>", lyricsBrakeByBackSlahN);

//   return (
//     <div className={classes.lyrics_modal}>
//       <Modal
//         open={open}
//         // onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         // hideBackdrop={true}
//       >
//         <Box sx={style}>
//           <Typography
//             id="modal-modal-title"
//             variant="h6"
//             component="h2"
//             style={{
//               color: "black",
//               textAlign: "center",
//               fontWeight: "bold",
//               position: "relative",
//             }}
//           >
//             LYRICS
//           </Typography>
//           <Typography
//             id="modal-modal-description"
//             sx={{ mt: 2 }}
//             style={{ color: "black", fontFamily: "cursive" }}
//           >
//             {/* {lyrics} */}
//             {lyricsBrakeByBackSlahN.map((text, index) => (
//               <p key={index} style={{ color: "unset", textAlign: "justify" }}>
//                 {text}
//               </p>
//             ))}
//           </Typography>
//           <span className={classes.cross_sign} onClick={handleClose}>
//             X
//           </span>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default withStyles(modalStyle)(LyricsModal);

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import classes from "./LyricsModal.module.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    scrollBehavior: "smooth",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    margin: theme.spacing(0),
    backgroundColor: "#ccaa6b",
    width: 350,
    height: 300,
    overflow: "auto",

    "&::-webkit-scrollbar": {
      width: 12,
      backgroundColor: "black",
    },
    "&::-webkit-scrollbar-track": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
      borderRadius: "10px",
      backgroundColor: "black",
    },
    "&::-webkit-scrollbar-thumb": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
      borderRadius: "10px",
      backgroundColor: "#876727f7",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555",
    },
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  console.log("onClose >>>>>>>>>>", onClose);

  return (
    <DialogTitle
      sx={{
        m: 0,
        py: 1,
        px: 2,
        width: "100%",
        fontSize: "1rem",
        fontWeight: "600",
        backgroundColor: "#ccaa6b",
        color: "#000000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      {...other}
    >
      {children}
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "unset",
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const LyricsDialogs = ({ setOpen, open, handleClose, handleOpen, lyrics }) => {
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
    <div className={classes.lyrics_dialog}>
      <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          LYRICS
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "black",
              textAlign: "center",
              fontSize: "1rem",
            }}
          >
            {lyricsBrakeByBackSlahN.map((text, index) => (
              <p key={index} style={{ color: "unset", textAlign: "justify" }}>
                {text}
              </p>
            ))}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default LyricsDialogs;
