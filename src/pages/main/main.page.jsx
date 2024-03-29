import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { auth } from "../../utils/firebase";
import { connect } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useLocation } from "react-router-dom";
import ListComponent from "../../components/list/list.components";
import ProfileComponent from "../../components/profile/profile.component";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessMedic from "../../components/access-medic/access-medic.component";
import AccessPatient from "../../components/access-patient/access-patient.component";

const drawerWidth = 240;

const switchRender = (path, currentUser) => {
  switch (path) {
    case `/${currentUser.id}`:
      return <ProfileComponent />;
    case "/pacientii%20mei":
      if (currentUser.role === "Medic") return <ListComponent />;
    case "/acces":
      if (currentUser.role === "Medic") {
        return <AccessMedic />;
      } else if (currentUser.role === "Pacient") {
        return <AccessPatient />;
      }
    default:
      break;
  }
};

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
      <Toolbar>{`Salut, ${currentUser.firstName}!`}</Toolbar>

      <Divider />
      {currentUser.role === "Medic" ? (
        <List>
          <ListItem
            button
            key="Profil"
            onClick={() => {
              navigate(`/${currentUser.id}`);
            }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profil" />
          </ListItem>
          {["Acces", "Pacientii mei"].map((text, index) => (
            <ListItem
              button
              key={text}
              onClick={() => {
                navigate(`/${text.toLowerCase()}`);
              }}
            >
              <ListItemIcon>
                {(() => {
                  if (index === 0) return <VisibilityIcon />;
                  if (index === 1) return <FormatListBulletedIcon />;
                  if (index === 2) return <EqualizerIcon />;
                })()}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          <ListItem
            button
            key="Profil"
            onClick={() => {
              navigate(`/${currentUser.id}`);
            }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profil" />
          </ListItem>
          <ListItem
            button
            key="Acces"
            onClick={() => {
              navigate("/acces");
            }}
          >
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Acces" />
          </ListItem>
        </List>
      )}
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
            <button
              style={{
                border: "1px solid black",
                borderRadius: "3px",
                height: "25px",
                width: "110px",
              }}
              onClick={() => auth.signOut()}
            >
              Deconectați-vă
            </button>
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
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
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
        {switchRender(location.pathname, currentUser)}
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
