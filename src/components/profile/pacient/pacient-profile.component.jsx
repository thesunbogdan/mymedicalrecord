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
import { createMedicalEvent } from "../../../utils/firebase";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider, MobileDateRangePicker } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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

      Data: "",
      Perioada: [null, null],
      Prescripție: "",
      Numele_medicului: "",
      Tipul_evenimentului: "Vizită medic familie",
      Diagnostic: "",
      Instituție: "",
      Detalii: "",
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
    if (name === "Tipul_evenimentului")
      this.setState({
        Numele_medicului: "",
        Data: "",
        Prescripție: "",
        Diagnostic: "",
        Instituție: "",
        Detalii: "",
        Perioada: [null, null],
        [name]: value,
      });
    else this.setState({ [name]: value });
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
      this.setState({
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
      this.setState({ showModal: showModal });
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
          {this.state.Tipul_evenimentului === "Vizită medic familie" ||
          this.state.Tipul_evenimentului === "Vizită medic specialist" ? (
            <>
              <div className="column">
                <FormControl fullWidth>
                  <InputLabel>Tipul evenimentului</InputLabel>
                  <Select
                    native
                    fullWidth
                    name="Tipul_evenimentului"
                    defaultValue={"Vizită medic familie"}
                    onChange={this.handleChange}
                  >
                    <option value={"Vizită medic familie"}>
                      Vizită medic familie
                    </option>
                    <option value={"Vizită medic specialist"}>
                      Vizită medic specialist
                    </option>
                    <option value={"Internare în spital"}>
                      Internare în spital
                    </option>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1 }} fullWidth>
                  <InputLabel>Diagnostic</InputLabel>
                  <Select
                    onChange={this.handleChange}
                    native
                    name="Diagnostic"
                    defaultValue=""
                    label="Diagnostic"
                  >
                    <optgroup label="Category 1">
                      <option disabled>&nbsp;&nbsp;Option 0</option>

                      <option value={1}>
                        &nbsp;&nbsp;&nbsp;&nbsp;Option 1
                      </option>
                      <option value={2}>
                        &nbsp;&nbsp;&nbsp;&nbsp;Option 2
                      </option>
                    </optgroup>
                    <optgroup label="Category 2">
                      <option disabled>&nbsp;&nbsp;Option 3</option>
                      <option value={4}>
                        &nbsp;&nbsp;&nbsp;&nbsp;Option 4
                      </option>
                    </optgroup>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Data"
                  autoComplete="off"
                  defaultValue={""}
                  name="Data"
                  value={this.state.Data}
                  type="date"
                  InputLabelProps={{ shrink: "true" }}
                  onChange={this.handleChange}
                />
                <TextField
                  fullWidth
                  label="Numele medicului"
                  name="Numele_medicului"
                  value={this.state.Numele_medicului}
                  autoComplete="off"
                  defaultValue={""}
                  onChange={this.handleChange}
                />
              </div>
              <div className="column">
                <TextField
                  fullWidth
                  label="Instituție"
                  name="Instituție"
                  value={this.state.Instituție}
                  autoComplete="off"
                  defaultValue={""}
                  onChange={this.handleChange}
                />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Prescripție"
                  name="Prescripție"
                  autoComplete="off"
                  value={this.state.Prescripție}
                  defaultValue={""}
                  onChange={this.handleChange}
                />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Detalii"
                  name="Detalii"
                  value={this.state.Detalii}
                  autoComplete="off"
                  defaultValue={""}
                  onChange={this.handleChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="column">
                <FormControl fullWidth>
                  <InputLabel>Tipul evenimentului</InputLabel>
                  <Select
                    native
                    fullWidth
                    name="Tipul_evenimentului"
                    defaultValue={"Vizită medic familie"}
                    onChange={this.handleChange}
                  >
                    <option value={"Vizită medic familie"}>
                      Vizită medic familie
                    </option>
                    <option value={"Vizită medic specialist"}>
                      Vizită medic specialist
                    </option>
                    <option value={"Internare în spital"}>
                      Internare în spital
                    </option>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDateRangePicker
                    inputFormat="yyyy/MM/dd"
                    startText="Data internare"
                    endText="Data externare"
                    value={this.state.Perioada}
                    onChange={(newValue) => {
                      this.setState({
                        Perioada: newValue,
                      });
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Numele medicului"
                  name="Numele_medicului"
                  value={this.state.Numele_medicului}
                  autoComplete="off"
                  defaultValue={""}
                  onChange={this.handleChange}
                />
                <FormControl sx={{ m: 1 }} fullWidth>
                  <InputLabel>Diagnostic</InputLabel>
                  <Select
                    onChange={this.handleChange}
                    native
                    name="Diagnostic"
                    defaultValue=""
                    label="Diagnostic"
                  >
                    <optgroup label="Category 1">
                      <option disabled>&nbsp;&nbsp;Option 0</option>

                      <option value={1}>
                        &nbsp;&nbsp;&nbsp;&nbsp;Option 1
                      </option>
                      <option value={2}>
                        &nbsp;&nbsp;&nbsp;&nbsp;Option 2
                      </option>
                    </optgroup>
                    <optgroup label="Category 2">
                      <option disabled>&nbsp;&nbsp;Option 3</option>
                      <option value={4}>
                        &nbsp;&nbsp;&nbsp;&nbsp;Option 4
                      </option>
                    </optgroup>
                  </Select>
                </FormControl>
              </div>
              <div className="column">
                <TextField
                  fullWidth
                  value={this.state.Instituție}
                  label="Instituție"
                  name="Instituție"
                  autoComplete="off"
                  defaultValue={""}
                  onChange={this.handleChange}
                />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Prescripție"
                  name="Prescripție"
                  autoComplete="off"
                  value={this.state.Prescripție}
                  defaultValue={""}
                  onChange={this.handleChange}
                />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Detalii"
                  name="Detalii"
                  value={this.state.Detalii}
                  autoComplete="off"
                  defaultValue={""}
                  onChange={this.handleChange}
                />
              </div>
            </>
          )}
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
                  Numele_medicului: "",
                  Data: "",
                  Prescripție: "",
                  Diagnostic: "",
                  Instituție: "",
                  Detalii: "",
                  Perioada: [null, null],
                });
              }}
            >
              CANCEL
            </button>

            <button
              onClick={() => {
                if (
                  this.state.Tipul_evenimentului === "Vizită medic familie" ||
                  this.state.Tipul_evenimentului === "Vizită medic specialist"
                )
                  createMedicalEvent(this.props.currentUser, {
                    Numele_medicului: this.state.Numele_medicului,
                    Data: this.state.Data,
                    Prescripție: this.state.Prescripție,
                    Diagnostic: this.state.Diagnostic,
                    Instituție: this.state.Instituție,
                    Detalii: this.state.Detalii,
                  });
                else if (
                  this.state.Tipul_evenimentului === "Internare în spital"
                )
                  createMedicalEvent(this.props.currentUser, {
                    Numele_medicului: this.state.Numele_medicului,
                    Prescripție: this.state.Prescripție,
                    Diagnostic: this.state.Diagnostic,
                    Instituție: this.state.Instituție,
                    Detalii: this.state.Detalii,
                    Perioada: [
                      `${new Date(this.state.Perioada[0]).getFullYear()}-${
                        new Date(this.state.Perioada[0]).getMonth() + 1
                      }-${new Date(this.state.Perioada[0]).getDate()}`,
                      `${new Date(this.state.Perioada[1]).getFullYear()}-${
                        new Date(this.state.Perioada[1]).getMonth() + 1
                      }-${new Date(this.state.Perioada[1]).getDate()}`,
                    ],
                  });
                else console.log("event type not expected");
                this.setState({ disabled: true });
              }}
            >
              DONE
            </button>
          </div>
        )}
        <p>{JSON.stringify(this.state)}</p>
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
                    <p>{key}</p> :{" "}
                    <p>
                      {key === "Perioada" ? `${value[0]} - ${value[1]}` : value}
                    </p>
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
