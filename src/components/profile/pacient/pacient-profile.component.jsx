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
import DropdownCascade from "react-dropdown-cascade";
import { createMedicalEvent } from "../../../utils/firebase";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

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
      profilePicture: this.props.currentUser.profilePicture,
      pacientBirthDate: this.props.currentUser.pacientBirthDate,

      disabled: true,

      diagnostic: "",
      fromDate: "",
      toDate: "",
      details: "",
      medic: "",
      institution: "",

      items: [
        {
          value: "I",
          label: "I",
          children: [
            {
              value: "1",
              label: "1",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
              ],
            },
            {
              value: "2",
              label: "2",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
              ],
            },
            {
              value: "3",
              label: "3",
              children: [
                { value: "a", label: "a" },
                { value: "a", label: "b" },
              ],
            },
          ],
        },
        {
          value: "II",
          label: "II",
          children: [
            {
              value: "1",
              label: "1",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
              ],
            },
            {
              value: "2",
              label: "2",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
              ],
            },
            {
              value: "3",
              label: "3",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
                { value: "c", label: "c" },
                { value: "d", label: "d" },
                { value: "e", label: "e" },
              ],
            },
          ],
        },
        {
          value: "III",
          label: "III",
          children: [
            {
              value: "1",
              label: "1",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
              ],
            },
            {
              value: "2",
              label: "2",
              children: [
                { value: "a", label: "a" },
                { value: "b", label: "b" },
              ],
            },
            {
              value: "3",
              label: "3",
              children: [
                { value: "a", label: "a" },
                { value: "a", label: "b" },
              ],
            },
          ],
        },
      ],
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
                zIndex: 200,
              },
              content: {
                zIndex: 201,
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
                  autoComplete="off"
                  fullWidth
                  label="First name"
                  name="firstName"
                  defaultValue={this.props.currentUser.firstName}
                  onChange={this.handleChange}
                />
                <TextField
                  autoComplete="off"
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
                  autoComplete="off"
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
                  autoComplete="off"
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
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    fullWidth
                    label="Gender"
                    name="gender"
                    defaultValue={this.props.currentUser.gender}
                    onChange={this.handleChange}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
                <input
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
                alt="profile"
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
                <p>
                  Height:{" "}
                  {this.props.currentUser.height
                    ? this.props.currentUser.height
                    : "(Please add your height)"}
                </p>
                <p>
                  Weight:{" "}
                  {this.props.currentUser.weight
                    ? this.props.currentUser.weight
                    : "(Please add your weight)"}
                </p>
                <p>
                  Gender:{" "}
                  {this.props.currentUser.gender
                    ? this.props.currentUser.gender
                    : "(Please add your gender)"}
                </p>
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

        <div
          className={`${
            this.state.disabled ? "medical-event disabled" : "medical-event"
          }`}
        >
          <div className="column">
            <div className="text-and-textfield">
              <p>Diagnostic: </p>
              <DropdownCascade
                separatorIcon=" &#8594; "
                customStyles={{
                  dropdown: {
                    style: {
                      margin: "5px 20px 15px 20px",
                    },
                  },
                }}
                items={this.state.items}
                onSelect={(value) => {
                  this.setState({ diagnostic: value });
                }}
                value={this.state.diagnostic}
              />
            </div>
            <div className="text-and-textfield">
              <p>From date:</p>
              <TextField
                autoComplete="off"
                defaultValue={this.state.fromDate}
                name="fromDate"
                type="date"
                onChange={this.handleChange}
              />
            </div>
            <div className="text-and-textfield">
              <p>To date:</p>
              <TextField
                autoComplete="off"
                defaultValue={this.state.toDate}
                name="toDate"
                type="date"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="column">
            <div className="text-and-textfield">
              <p>Medic:</p>
              <TextField
                autoComplete="off"
                name="medic"
                defaultValue={this.state.medic}
                onChange={this.handleChange}
              />
            </div>
            <div className="text-and-textfield">
              <p>Instiution:</p>
              <TextField
                autoComplete="off"
                name="institution"
                defaultValue={this.state.institution}
                onChange={this.handleChange}
              />
            </div>
            <div className="text-and-textfield">
              <p>Details:</p>
              <TextField
                autoComplete="off"
                name="details"
                defaultValue={this.state.details}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* <p>{this.state.diagnostic}</p>
          <p>{this.state.fromDate}</p>
          <p>{this.state.toDate}</p>
          <p>{this.state.medic}</p>
          <p>{this.state.institution}</p>
          <p>{this.state.details}</p> */}
        </div>
        {this.state.disabled ? (
          <button
            style={{ zIndex: 50 }}
            onClick={() => {
              this.setState({ disabled: false });
            }}
          >
            ADD MEDICAL EVENT
          </button>
        ) : (
          <div className="medical-event-done-cancel">
            <button
              onClick={() => {
                this.setState({
                  disabled: true,
                  diagnostic: "",
                  fromDate: "",
                  toDate: "",
                  details: "",
                  medic: "",
                  institution: "",
                });
              }}
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                createMedicalEvent(this.props.currentUser, {
                  diagnostic: this.state.diagnostic,
                  fromDate: this.state.fromDate,
                  toDate: this.state.toDate,
                  medic: this.state.medic,
                  institution: this.state.institution,
                  details: this.state.details,
                });
                this.setState({ disabled: true });
              }}
            >
              DONE
            </button>
          </div>
        )}

        {this.props.currentUser.medicalRecord.map((item, index) => {
          return (
            <div key={index} className="medical-event">
              {Object.entries(item).map(([key, value]) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <p>{key}</p> : <p>{value}</p>
                  </div>
                );
              })}
              {console.log(item)}
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PacientProfile);
