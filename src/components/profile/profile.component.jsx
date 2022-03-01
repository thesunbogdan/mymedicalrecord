import React from "react";
import { connect } from "react-redux";
import MedicProfile from "./medic/medic-profile.component";

const Profile = (props) => {
  const { role } = props.currentUser;

  if (role === "Medic") {
    return <MedicProfile />;
  } else if (role === "Pacient") {
    return <div></div>;
  } else {
    return <div></div>;
  }
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Profile);
