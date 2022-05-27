import React from "react";
import { connect } from "react-redux";
import MedicProfile from "./medic/medic-profile.component";
import PacientProfile from "./pacient/pacient-profile.component";

const Profile = (props) => {
  const { role } = props.currentUser;

  if (role === "Medic") {
    return <MedicProfile />;
  } else if (role === "Pacient") {
    return <PacientProfile />;
  } else {
    return <div>Invalid account role: Neither Medic nor Pacient</div>;
  }
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Profile);
