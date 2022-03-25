import React from "react";
import "./profile-card.styles.scss";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";

const ProfileCard = ({ props }) => {
  const { index, firstName, lastName, profilePictureURL } = props;
  console.log("fasfasfas: " + props);
  return (
    <div key={index} className="profile-card">
      <div className="picture-and-age">
        <div className="picture">
          <img
            src={profilePictureURL ? profilePictureURL : basicProfilePictureURL}
          />
        </div>
        <div className="age">
          <p>26 years old</p>
        </div>
      </div>
      <div className="name-and-buttons">
        <div className="name">
          <h1>{lastName},</h1>
          <h3>{firstName}</h3>
        </div>
        <div className="buttons">
          <button>Request Access</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
