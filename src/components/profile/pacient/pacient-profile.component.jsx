import React from "react";
import "./pacient-profile.styles.scss";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import TextField from "@mui/material/TextField";
import { updateUserProfileDocument } from "../../../utils/firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { updateUserProfilePicture } from "../../../utils/firebase";
import EditIcon from "@mui/icons-material/Edit";
import { basicProfilePictureURL } from "../../../utils/basic-profile-picture";
import InputAdornment from "@mui/material/InputAdornment";

class PacientProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,

      firstName: this.props.currentUser.firstName,
      lastName: this.props.currentUser.lastName,
      profilePictureURL: this.props.currentUser.profilePictureURL,
      tel: this.props.currentUser.tel,
      gender: this.props.currentUser.gender,
      height: this.props.currentUser.height,
      weight: this.props.currentUser.weight,
      medicalRecord: this.props.currentUser.medicalRecord,
      profilePicture: this.props.currentUser.profilePicture,
      pacientBirthDate: this.props.currentUser.pacientBirthDate,
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

    // to be updated with pacient related data

    const {
      firstName,
      lastName,
      profilePictureURL,
      tel,
      height,
      weight,
      gender,
    } = this.state;

    try {
      const showModal = await updateUserProfileDocument(
        this.props.currentUser,
        {
          firstName,
          lastName,
          profilePictureURL,
          tel,
          height,
          weight,
          role: "Pacient",
          gender,
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
      <div className="pacient-profile">
        <div className="medic-profile-first-row">
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
                  fullWidth
                  label="First name"
                  name="firstName"
                  defaultValue={this.props.currentUser.firstName}
                  onChange={this.handleChange}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  defaultValue={this.props.currentUser.lastName}
                  onChange={this.handleChange}
                />

                <PhoneInput
                  inputStyle={{ width: "100%" }}
                  specialLabel="Telephone number"
                  country={"ro"}
                  value={this.props.currentUser.tel}
                  onChange={(phoneNumber) =>
                    this.setState({ tel: phoneNumber })
                  }
                />
              </div>
              <div className="modal-column">
                <TextField
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label="Weight"
                  name="weight"
                  defaultValue={this.props.currentUser.weight}
                  onChange={this.handleChange}
                />
                <TextField
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">cm</InputAdornment>
                    ),
                  }}
                  label="Height"
                  name="height"
                  defaultValue={this.props.currentUser.height}
                  onChange={this.handleChange}
                />
                <TextField
                  fullWidth
                  label="Gender"
                  name="gender"
                  defaultValue={this.props.currentUser.gender}
                  onChange={this.handleChange}
                />
                <input
                  fullWidth
                  name="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={this.getFile}
                />
              </div>
            </div>
          </ReactModal>
          <div className="first-column">
            <button onClick={this.handleOpenModal} className="modal-open-btn">
              <EditIcon fontSize="small" />
              <p>EDIT</p>
            </button>
            <div className="half-column">
              <img
                className="profile-image"
                src={`${
                  this.props.currentUser.profilePictureURL
                    ? this.props.currentUser.profilePictureURL
                    : basicProfilePictureURL
                }`}
              />
            </div>
            <div className="half-column">
              <h1 className="medic-name">
                {this.props.currentUser.firstName}&nbsp;
                {this.props.currentUser.lastName}
              </h1>
              <div className="medic-function-institution">
                <p>Height: {this.props.currentUser.height}</p>
                <p>Weight: {this.props.currentUser.weight}</p>
                <p>Gender: {this.props.currentUser.gender}</p>
              </div>
            </div>
          </div>

          <div className="column">
            <h1 className="title">Contact</h1>
            <div className="column-bottom">
              <button className="contact-button">
                <PhoneIcon />
                <p>
                  &nbsp;
                  {this.props.currentUser.tel
                    ? this.props.currentUser.tel
                    : "Please add a phone number"}
                </p>
              </button>

              <button className="contact-button">
                <MailIcon />
                &nbsp;
                <p>{this.props.currentUser.email}</p>
              </button>
            </div>
          </div>
        </div>
        <div className="medical-profile-second-row">
          <button>ADD MEDICAL EVENT</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PacientProfile);
