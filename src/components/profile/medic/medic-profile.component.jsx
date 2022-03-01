import React from "react";
import "./medic-profile.styles.scss";
import ProfilePicture from "./doctor.jpg";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import TextField from "@mui/material/TextField";
import { updateUserProfileDocument } from "../../../utils/firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { updateUserProfilePicture } from "../../../utils/firebase";

class MedicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,

      firstName: this.props.currentUser.firstName,
      lastName: this.props.currentUser.lastName,
      profilePictureURL: this.props.currentUser.profilePictureURL,
      tel: this.props.currentUser.tel,
      medicFunction: this.props.currentUser.medicFunction,
      medicInstitution: this.props.currentUser.medicInstitution,
      profilePicture: null,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  getFile = async (event) => {
    await this.setState({ profilePicture: event.target.files[0] });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const profilePictureRes = await updateUserProfilePicture(
      this.props.currentUser,
      this.state.profilePicture
    );
    if (profilePictureRes) {
      await this.setState({
        profilePictureURL: profilePictureRes,
      });
    }

    const {
      firstName,
      lastName,
      profilePictureURL,
      tel,
      medicFunction,
      medicInstitution,
    } = this.state;

    try {
      const showModal = await updateUserProfileDocument(
        this.props.currentUser,
        {
          firstName,
          lastName,
          profilePictureURL,
          tel,
          medicFunction,
          medicInstitution,
          role: "Medic",
        }
      );
      console.log("const showModal " + showModal);
      this.setState({ showModal: showModal });
      console.log("this.state.showModal" + this.state.showModal);
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <div className="profile">
        <ReactModal
          isOpen={this.state.showModal}
          style={{
            overlay: {
              left: `${window.innerWidth < 600 ? "0" : "240px"} `,
              top: "60px",
            },
            content: {
              backgroundColor: "white",
              flexWrap: "wrap",
              justifyContent: "space-around",
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "0.1fr 1fr",
              gap: "0px",
            },
          }}
        >
          <div className="modal-grid-top">
            <button
              className="modal-close-button"
              onClick={this.handleCloseModal}
            >
              X{" "}
            </button>
            <button onClick={this.handleSubmit}>DONE</button>
          </div>
          <div className="modal-grid-bottom">
            <div className="modal-column">
              <TextField
                label="First name"
                name="firstName"
                defaultValue={this.props.currentUser.firstName}
                onChange={this.handleChange}
              />
              <TextField
                label="Last name"
                name="lastName"
                defaultValue={this.props.currentUser.lastName}
                onChange={this.handleChange}
              />

              <PhoneInput
                specialLabel="Telephone number"
                country={"ro"}
                value={this.props.currentUser.tel}
                onChange={(phoneNumber) => this.setState({ tel: phoneNumber })}
              />
            </div>
            <div className="modal-column">
              <TextField
                label="Medical Function"
                name="medicFunction"
                defaultValue={this.props.currentUser.medicFunction}
                onChange={this.handleChange}
              />
              <TextField
                label="Medical Institution"
                name="medicInstitution"
                defaultValue={this.props.currentUser.medicInstitution}
                onChange={this.handleChange}
              />
              <input
                name="profile-picture"
                type="file"
                accept="image/*"
                onChange={this.getFile}
              />
            </div>
          </div>
        </ReactModal>
        <div className="profile-column">
          <div className="profile-avatar">
            <div className="profile-avatar-button">
              <button onClick={this.handleOpenModal}>EDIT</button>
            </div>
            <div className="profile-avatar-photo">
              <img
                src={`${
                  this.props.currentUser.profilePictureURL
                    ? this.props.currentUser.profilePictureURL
                    : ProfilePicture
                }`}
                alt="profile-picture"
              />
            </div>
            <div className="profile-avatar-name">
              <h1>
                {this.props.currentUser.firstName}{" "}
                {this.props.currentUser.lastName}{" "}
              </h1>
            </div>
            <div className="profile-avatar-other">
              <h3>{this.props.currentUser.medicFunction}</h3>
              <hr />
              <h3>{this.props.currentUser.medicInstitution}</h3>
            </div>
          </div>
        </div>{" "}
        <div className="profile-column">
          <div className="profile-bio">
            <div className="profile-bio-title">
              <h2>Bio</h2>
            </div>
            <div className="profile-bio-text">
              <p>
                Qui voluptate sint cillum officia. Nulla quis sint officia elit
                nulla aute veniam mollit aliquip occaecat sit adipisicing.
                Incididunt nisi cupidatat tempor laborum. Occaecat ipsum nostrud
                sit non. Ut id dolor aliqua occaecat adipisicing id esse laborum
                dolore ex duis labore. Quis enim anim anim duis dolor culpa ad
                aliqua magna ipsum.
              </p>
              <p>
                Irure ex velit elit occaecat irure excepteur incididunt duis
                consequat excepteur. Sint et nulla laborum minim elit velit
                cillum culpa et sit pariatur elit exercitation nisi. Commodo
                labore fugiat fugiat deserunt nostrud voluptate. Ad quis id amet
                amet.
              </p>
            </div>
          </div>
        </div>
        <div className="profile-column">
          <div className="profile-contact">
            <div className="profile-contact-title">
              <h2>Contact</h2>
            </div>

            <div className="profile-contact-button-one">
              <button>
                <PhoneIcon />
                <p>{this.props.currentUser.tel}</p>
              </button>
            </div>

            <div className="profile-contact-button-two">
              <button>
                <MailIcon />
                <p>{this.props.currentUser.email}</p>
              </button>
            </div>

            <div className="profile-contact-button-three">
              <button>
                <LocationOnIcon />
                <p>Str fasf, nr 5</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(MedicProfile);
