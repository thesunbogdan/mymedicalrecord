import React from "react";
import "./medic-profile.styles.scss";
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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { basicProfilePictureURL } from "../../../utils/basic-profile-picture";

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
      profilePicture: this.props.currentUser.profilePicture,
      location: this.props.currentUser.location,
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
      location,
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
          location,
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
      <div className="medic-profile">
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
                onChange={(phoneNumber) => this.setState({ tel: phoneNumber })}
              />
            </div>
            <div className="modal-column">
              <TextField
                fullWidth
                label="Medical Function"
                name="medicFunction"
                defaultValue={this.props.currentUser.medicFunction}
                onChange={this.handleChange}
              />
              <TextField
                fullWidth
                label="Medical Institution"
                name="medicInstitution"
                defaultValue={this.props.currentUser.medicInstitution}
                onChange={this.handleChange}
              />
              <TextField
                fullWidth
                label="Institution Location"
                name="location"
                defaultValue={this.props.currentUser.location}
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
              alt="profile"
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
              <h2>{this.props.currentUser.medicFunction}</h2>
              <p> | </p>
              <h2>{this.props.currentUser.medicInstitution}</h2>
            </div>
          </div>
        </div>
        <div className="column">
          <h1 className="title">Bio</h1>
          <div className="column-bottom">
            <p>
              Ad fugiat irure nulla ea fugiat dolore ipsum. Deserunt dolor anim
              irure incididunt irure eu magna nisi ullamco aliquip ipsum eu.
              Sunt veniam fugiat sit excepteur elit ullamco laborum et minim
              nisi ullamco amet occaecat irure.
            </p>
            <p>
              Tempor aute sit qui consequat irure officia ipsum ad nostrud est
              commodo. Commodo eu dolor elit ad irure duis dolor duis
              adipisicing ea do officia occaecat. Ex culpa aliquip ut sunt minim
              esse eiusmod ex in fugiat mollit ipsum fugiat.
            </p>
            <p>
              Lorem anim consectetur ullamco proident amet irure qui mollit
              adipisicing aute. Pariatur tempor aliquip irure ut officia magna
              quis adipisicing nisi Lorem laborum labore minim. Fugiat pariatur
              dolor deserunt cillum dolore nisi ullamco eu anim esse.
            </p>
          </div>
        </div>

        <div className="column">
          <h1 className="title">Contact</h1>
          <div className="column-bottom">
            <button className="contact-button">
              <PhoneIcon />
              <p>
                {this.props.currentUser.tel
                  ? this.props.currentUser.tel
                  : "Please add a phone number"}
              </p>
            </button>

            <button className="contact-button">
              <MailIcon />
              <p>{this.props.currentUser.email}</p>
            </button>

            <button className="contact-button">
              <LocationOnIcon />
              <p>
                {this.props.currentUser.location
                  ? this.props.currentUser.location
                  : "Please add medical institution location"}
              </p>
            </button>
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
