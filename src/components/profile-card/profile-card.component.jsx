import React from "react";
import "./profile-card.styles.scss";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";
import { sendRequest } from "../../utils/firebase";
import { cancelRequest } from "../../utils/firebase";

const ProfileCard = (props) => {
  const { firstName, lastName, profilePictureURL, pacientId, myMedicsPending } =
    props.item;
  const { index } = props.index;
  const medicId = props.medic.id;

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
          {myMedicsPending?.filter((item) => item === medicId).length > 0 ? (
            <button onClick={() => cancelRequest(medicId, pacientId)}>
              Cancel Request
            </button>
          ) : (
            <button onClick={() => sendRequest(medicId, pacientId)}>
              Request Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
