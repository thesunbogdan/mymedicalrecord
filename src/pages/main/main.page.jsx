import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { auth } from "../../utils/firebase";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useLocation } from "react-router-dom";
import ListComponent from "../../components/list/list.components";
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const { window, currentUser } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>{`Hello, ${currentUser.displayName}!`}</Toolbar>

      <Divider />
      <List>
        {["Profile", "Pacients", "Statistics"].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={() => {
              navigate(`/${text.toLowerCase()}`);
            }}
          >
            <ListItemIcon>
              {(() => {
                if (index === 0) return <PersonIcon />;
                if (index === 1) return <FormatListBulletedIcon />;
                if (index === 2) return <EqualizerIcon />;
              })()}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {currentUser ? (
            <Link to="/login" onClick={() => auth.signOut()}>
              SIGN OUT
            </Link>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {location.pathname === "/pacients" ? (
          <ListComponent />
        ) : (
          <p>{location.pathname}</p>
        )}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ResponsiveDrawer);
