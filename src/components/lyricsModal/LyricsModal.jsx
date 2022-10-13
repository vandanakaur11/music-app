import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#E9D8B0",
  border: "2px solid #000",
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
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ color: "black", textAlign: "center", fontWeight: "bold" }}
          >
            LYRICS
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ color: "black", fontFamily: "cursive" }}
          >
            {lyrics}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
