import React, { useContext, useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import LoginContext from "../Context/LoginContext";
import { getFirestore } from "../Dao/FirebaseDao";
import LogoutIcon from "../icons/logout.svg";
import Request from "../Models/Request";
import { REQUEST_PENDING } from "../AppConstants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    }
  })
);

export default function Header() {
  const classes = useStyles();
  const {
    state: { loginInfo },
    actions: { signOut }
  } = useContext<any>(LoginContext);
  const [department, setDepartment] = useState();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl
  ] = React.useState<null | HTMLElement>(null);

  const [approvalRequestList, setApprovalRequestList] = useState<Request[]>([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleLogout = () => {
    signOut();
  };
  function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{loginInfo.user.email}</MenuItem>
      <MenuItem onClick={handleMenuClose}>{department}</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>{loginInfo.user.email}</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>{department ? department : null}</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <Badge
            badgeContent={
              approvalRequestList.length > 0 ? approvalRequestList.length : null
            }
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleLogout}>
        <IconButton color="inherit">
          <img src={LogoutIcon} />
        </IconButton>
        <p>Logout </p>
      </MenuItem>
    </Menu>
  );
  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      getFirestore()
        .collection("requests")
        .where("status", "==", REQUEST_PENDING)
        .onSnapshot(collectionSnapshot => {
          if (collectionSnapshot) {
            var requests: Request[] = [];
            collectionSnapshot.forEach(QuerySnapshot => {
              if (QuerySnapshot) {
                var data = QuerySnapshot.data();
                var id = QuerySnapshot.id;
                if (data && id) {
                  if (loginInfo.user) {
                    var ownerEmail = loginInfo.user.email;
                    if (ownerEmail && data.toEmail === ownerEmail)
                      requests.push(data);
                  }
                }
              }
            });
            setApprovalRequestList(requests);
          }
        });
      getFirestore()
        .collection("users")
        .doc(loginInfo.user.email)
        .onSnapshot(snapshot => {
          if (snapshot) {
            var data = snapshot.data();
            if (data) {
              setDepartment(data.department);
            }
          }
        });
    }
  }, []);
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <NavLink to="/Home" className="header-link">
              Form
            </NavLink>
          </Typography>

          <NavLink
            to="/Pending"
            className="header-link"
            activeClassName="header-link-active"
          >
            Pending
          </NavLink>
          <NavLink
            to="/Approved"
            className="header-link"
            activeClassName="header-link-active"
          >
            Approved
          </NavLink>
          <NavLink
            to="/RequestForApproval"
            className="header-link"
            activeClassName="header-link-active"
          >
            Request For Approval
          </NavLink>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit">
              <Badge
                badgeContent={
                  approvalRequestList.length > 0
                    ? approvalRequestList.length
                    : null
                }
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-owns={isMenuOpen ? "material-appbar" : undefined}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMobileMenu}
    </div>
  );
}
