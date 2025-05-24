import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import { resetNotificationCount } from "../../redux/reducers/chat";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const dispatch = useDispatch();

  const { isSearch, isNotification,isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);

  
  const navigate = useNavigate();
  const handleMobile = () => {
    // console.log(set)
    dispatch(setIsMobile(true));
  };

  const openSearch = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(data.message);
      dispatch(userNotExists());
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  return (
    <>
    <Box sx={{ flexGrow: 1 }} height={"4rem"}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Gradient background
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: '#ffffff'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              fontFamily: 'Cursive',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}
          >
            Wavely
          </Typography>

          <Box
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
            }}
          >
            <IconButton color="inherit" onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconBtn
              onClick={openSearch}
              title="Search"
              icon={<SearchIcon />}
            />
            <IconBtn
              onClick={openNewGroup}
              title="New Group"
              icon={<AddIcon />}
            />
            <IconBtn
              onClick={navigateToGroup}
              title="Manage Groups"
              icon={<GroupIcon />}
            />
            <IconBtn
              onClick={openNotification}
              title="Notifications"
              icon={<NotificationsIcon />}
              value={notificationCount}
            />
            <IconBtn
              onClick={logoutHandler}
              title="Logout"
              icon={<LogoutIcon />}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    {isSearch && (
      <Suspense fallback={<Backdrop open />}>
        <SearchDialog />
      </Suspense>
    )}
    {isNotification && (
      <Suspense fallback={<Backdrop open />}>
        <NotificationDialog />
      </Suspense>
    )}
    {isNewGroup && (
      <Suspense fallback={<Backdrop open />}>
        <NewGroupDialog />
      </Suspense>
    )}
  </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" onClick={onClick} size="large">
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      
      </IconButton>
    </Tooltip>
  );
};

export default Header;
