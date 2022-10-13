import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
// import classes from "./SideDrawer.module.css";
// import classes from "./SideDrawer.module.css";
import { makeStyles } from "@material-ui/core";
import { MusicNote } from "@material-ui/icons";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useRouter } from "next/router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFavouriteId } from "../../store/musicReducer";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#ccaa6b",

    "@media (max-width:1800px)": {
      width: "25vw",
    },
    "@media (max-width:1500px)": {
      width: "35vw",
    },

    "@media (max-width:1300px)": {
      width: "40vw",
    },
    "@media (max-width:1200px)": {
      width: "45vw",
    },

    "@media (max-width:900px)": {
      width: "50vw",
    },
    "@media (max-width:700px)": {
      width: "55vw",
    },
    "@media (max-width:600px)": {
      width: "65vw",
    },
    "@media (max-width:500px)": {
      width: "80vw",
    },
    "@media (max-width:400px)": {
      width: "90vw",
    },
  },
  playlistDrawerHeading: {
    textAlign: "center",
    color: "#382b11",
    margin: "20px 0px",
  },
  playlistInnerWrap: {
    padding: "0px 2vw",
  },
  innerWrapInner: {
    display: "flex",

    backgroundColor: "#382b11",
    borderRadius: "4px",
    width: "100%",
    flexDirection: "row",
    margin: "5px 0px",
    padding: "0 10px",
  },
  innerWrapname: {
    display: "flex",
    alignItems: "center",
  },
  playlistTextInner: {
    color: "#fff !important",
    margin: "10px 0px",
  },
  playlistWrap: {
    display: "flex",
  },
  playlistText: {
    color: "#fff !important",
    margin: "0px 6px",
    fontWeight: "bold",
    "@media (max-width:991px)": {
      display: "none",
    },
  },
  playlistIcon: {
    margin: "0px 6px",
    fontWeight: "bold",
    color: "#fff !important",
  },
}));
const postSelector = (state) => state.music;

function TemporaryDrawer() {
  const dispatch = useDispatch();
  const { user, favourites } = useSelector(postSelector, shallowEqual);
  // console.log(favourites)
  const route = useRouter();
  const classes = useStyles();
  const [state, setState] = React.useState({
    // top: false,
    // left: false,
    // bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  function handleClick(album, index) {
    // console.log(album, index);
    dispatch(setFavouriteId(album?._id));

    // dispatch(setFavouriteIndex(index))
    if (!user) {
      route.replace("/login");
      return;
    }
    route.push(`/album/${album?.Album_Name}`);
  }

  const list = (anchor) => (
    <Box
      // sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      // className={classes.drawerWrap}
    >
      <h1 className={classes.playlistDrawerHeading}>Your Playlist</h1>
      <List className={classes.playlistInnerWrap}>
        {/* {["King of Kings", "Prince of Peace", "Lord of Lords", "Bread of Life"].map((text, index) => ( */}
        {favourites?.map((item, index) => (
          <ListItem
            button
            key={item?._id}
            onClick={() => handleClick(item, index)}
          >
            {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
            <div className={classes.innerWrapInner}>
              <div className={classes.innerWrapname}>
                <ListItemIcon className={classes.playlistTextInner}>
                  {<MusicNote />}
                </ListItemIcon>
                <ListItemText
                  primary={item?.Song_Name}
                  className={classes.playlistTextInner}
                />
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
      {/* <List>
                {["All mail", "Trash", "Spam"].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List> */}
    </Box>
  );

  return (
    <div className={classes.mainWrap}>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <div className={classes.playlistWrap}>
              <div className={classes.playlistText}>Playlist</div>
              <div className={classes.playlistIcon}>
                <QueueMusicIcon />
              </div>
            </div>
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            classes={{ paper: classes.paper }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
export default React.memo(TemporaryDrawer);
