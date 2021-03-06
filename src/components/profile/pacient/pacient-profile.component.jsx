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
import { Chip, OutlinedInput } from "@mui/material";
import { Box } from "@mui/system";
import Autocomplete from "@mui/material/Autocomplete";
import { CIMdata } from "../../../utils/CIMdata";

class PacientProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,

      firstName: this.props.currentUser.firstName,
      lastName: this.props.currentUser.lastName,
      profilePictureURL: this.props.currentUser.profilePictureURL,
      tel: this.props.currentUser.tel,
      gen: this.props.currentUser.gen,
      înălțime: this.props.currentUser.înălțime,
      greutate: this.props.currentUser.greutate,
      profilePicture: this.props.currentUser.profilePicture,
      pacientBirthDate: this.props.currentUser.pacientBirthDate,

      disabled: true,

      comorbiditățiPosibile: [
        "Obezitate",
        "Diabet",
        "Hipertensiune arterială",
        "Insuficiența cardiacă",
        "Astm cronic",
        "Boli pulmonare",
        "Boli autoimune",
        "Boli renale cronice",
        "Boli digestive cronice",
        "Hepatita cronică",
      ],
      searchMedicName: "",
      searchEventType: "",
      comorbidități: [],
      data: "",
      perioada: [null, null],
      prescripție: "",
      numele_medicului: "",
      tipul_evenimentului: "Vizită medic familie",
      diagnostic: "",
      instituție: "",
      detalii: "",

      anul: "",
      ziua: "",
      luna: "",
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }
  handleMultipleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setState({
      comorbidități: typeof value === "string" ? value.split(",") : value,
    });
  };

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (name === "tipul_evenimentului")
      this.setState({
        numele_medicului: "",
        data: "",
        prescripție: "",
        diagnostic: "",
        instituție: "",
        detalii: "",
        perioada: [null, null],
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
      înălțime,
      greutate,
      gen,
      comorbidități,
    } = this.state;

    try {
      const showModal = await updateUserProfileDocument(
        this.props.currentUser,
        {
          comorbidități,
          firstName,
          lastName,
          profilePictureURL,
          tel,
          înălțime,
          greutate,
          role: "Pacient",
          gen,
        }
      );
      this.setState({ showModal: showModal });
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <div className="patient-profile">
        <div className="profile-card">
          <button onClick={this.handleOpenModal} className="modal-open-button">
            <EditIcon fontSize="small" />
            <p>Modifică</p>
          </button>

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
              },
            }}
          >
            <div className="patient-modal-body">
              <div className="patient-modal-top">
                <button
                  className="modal-close-button"
                  onClick={this.handleCloseModal}
                >
                  Abandonează
                </button>
                <button onClick={this.handleSubmit}>Trimite</button>
              </div>
              <TextField
                className="margin"
                autoComplete="off"
                fullWidth
                label="First name"
                name="firstName"
                defaultValue={this.props.currentUser.firstName}
                onChange={this.handleChange}
              />
              <TextField
                className="margin"
                autoComplete="off"
                fullWidth
                label="Last name"
                name="lastName"
                defaultValue={this.props.currentUser.lastName}
                onChange={this.handleChange}
              />

              <PhoneInput
                className="margin"
                inputStyle={{ width: "100%" }}
                specialLabel="Telephone number"
                country={"ro"}
                value={this.props.currentUser.tel}
                onChange={(phoneNumber) => this.setState({ tel: phoneNumber })}
              />
              <TextField
                className="margin"
                autoComplete="off"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                label="Greutate"
                name="greutate"
                defaultValue={this.props.currentUser.greutate}
                onChange={this.handleChange}
              />
              <TextField
                className="margin"
                autoComplete="off"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                label="Înălțime"
                name="înălțime"
                defaultValue={this.props.currentUser.înălțime}
                onChange={this.handleChange}
              />
              <FormControl sx={{ m: 1 }} fullWidth className="margin">
                <InputLabel>Comorbidități</InputLabel>
                <Select
                  label="Comorbidități"
                  multiple
                  value={this.state.comorbidități}
                  onChange={this.handleMultipleSelectChange}
                  input={<OutlinedInput label="Comorbidități" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {this.state.comorbiditățiPosibile.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className="margin">
                <InputLabel>Gen</InputLabel>
                <Select
                  fullWidth
                  label="Gen"
                  name="gen"
                  defaultValue={this.props.currentUser.gen}
                  onChange={this.handleChange}
                >
                  <MenuItem value={"Masculin"}>Masculin</MenuItem>
                  <MenuItem value={"Feminin"}>Feminin</MenuItem>
                </Select>
              </FormControl>

              <input
                name="profile-picture"
                type="file"
                accept="image/*"
                onChange={this.getFile}
                className="margin"
              />
            </div>
          </ReactModal>

          <div className="column">
            <div className="profile-photo-div">
              <img
                alt="forografie de profil"
                className="profile-photo-image"
                src={`${
                  this.props.currentUser.profilePictureURL
                    ? this.props.currentUser.profilePictureURL
                    : basicProfilePictureURL
                }`}
              />
            </div>
            <div className="header">
              {this.props.currentUser.firstName}&nbsp;
              {this.props.currentUser.lastName}
            </div>

            <div className="email-tel">
              <button className="email">
                {" "}
                <MailIcon /> <p>{this.props.currentUser.email}</p>
              </button>
              <button className="email">
                {" "}
                <PhoneIcon />{" "}
                <p>
                  {this.props.currentUser.tel
                    ? this.props.currentUser.tel
                    : "Please add a phone number"}
                </p>
              </button>
            </div>

            <button
              onClick={async (event) => {
                navigator.clipboard.writeText(this.props.currentUser.id);
                event.target.innerHTML = "Copiat";
                await new Promise((res) => setTimeout(res, 1500));
                event.target.innerHTML = "ID: " + this.props.currentUser.id;
              }}
              onMouseEnter={(event) => {
                if (event.target.innerHTML !== "Copiat")
                  event.target.innerHTML = "Apasă pentru a copia";
              }}
              onMouseLeave={(event) => {
                if (event.target.innerHTML !== "Copiat")
                  event.target.innerHTML = "ID: " + this.props.currentUser.id;
              }}
              className="tooltip"
            >
              ID: {this.props.currentUser.id}
            </button>
          </div>

          <div className="column">
            <div className="attribute">
              <p>Vârstă: </p>
              <p>
                {this.getAge(
                  this.props.currentUser.pacientBirthDate["seconds"] * 1000
                )}{" "}
                ani
              </p>
            </div>

            <div className="attribute">
              <p>Gen: </p>{" "}
              <p>
                {this.props.currentUser.gen
                  ? this.props.currentUser.gen
                  : "(Nu ați adăugat genul)"}
              </p>
            </div>

            <div className="attribute">
              {" "}
              <p>Înălțime: </p>
              <p>
                {this.props.currentUser.înălțime
                  ? `${this.props.currentUser.înălțime} cm`
                  : "(Nu ați adăugat înălțimea)"}
              </p>{" "}
            </div>

            <div className="attribute">
              {" "}
              <p>Greutate:</p>
              <p>
                {this.props.currentUser.greutate
                  ? `${this.props.currentUser.greutate} kg`
                  : "(Nu ați adăugat greutatea)"}
              </p>
            </div>

            <div className="attribute">
              {" "}
              <p>Comorbidități:</p>
              <div className="comorbidities">
                {this.props.currentUser.comorbidități.length !== 0
                  ? this.props.currentUser.comorbidități.map((com) => (
                      <div className="comorbidity">
                        {com}
                        &nbsp;
                      </div>
                    ))
                  : "(Nu prezintă comorbidități)"}
              </div>
            </div>
          </div>
          <div className="toggle-add-medical-event">
            <button
              className="toggle-add-medical-event-button"
              onClick={() => {
                this.setState({ disabled: false });
              }}
            >
              Adaugă eveniment medical
            </button>
          </div>
        </div>
        {!this.state.disabled ? (
          <div className="add-medical-event">
            {this.state.tipul_evenimentului === "Vizită medic familie" ||
            this.state.tipul_evenimentului === "Vizită medic specialist" ? (
              <div className="add-medical-event-wrap">
                <div className="column">
                  <FormControl fullWidth>
                    <InputLabel>Tipul evenimentului</InputLabel>
                    <Select
                      label="Tipul evenimentului"
                      native
                      fullWidth
                      name="tipul_evenimentului"
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
                  <Autocomplete
                    disablePortal
                    name="diagnostic"
                    onChange={(event, newValue) => {
                      this.setState({ diagnostic: newValue["label"] });
                    }}
                    options={CIMdata}
                    renderInput={(params) => (
                      <TextField {...params} label="Diagnostic" />
                    )}
                  />
                  <TextField
                    fullWidth
                    label="Data"
                    autoComplete="off"
                    name="data"
                    value={this.state.data}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={this.handleChange}
                  />

                  <TextField
                    fullWidth
                    label="Numele medicului"
                    name="numele_medicului"
                    value={this.state.numele_medicului}
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="column">
                  <TextField
                    fullWidth
                    label="Instituție"
                    name="instituție"
                    value={this.state.instituție}
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Prescripție"
                    name="prescripție"
                    autoComplete="off"
                    value={this.state.prescripție}
                    onChange={this.handleChange}
                  />
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Detalii"
                    name="detalii"
                    value={this.state.detalii}
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="add-medical-event-wrap">
                <div className="column">
                  <FormControl fullWidth>
                    <InputLabel>Tipul evenimentului</InputLabel>
                    <Select
                      label="Tipul evenimentului"
                      native
                      fullWidth
                      name="tipul_evenimentului"
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
                      value={this.state.perioada}
                      onChange={(newValue) => {
                        this.setState({
                          perioada: newValue,
                        });
                      }}
                      renderInput={(startProps, endProps) => (
                        <React.Fragment>
                          <TextField
                            {...startProps}
                            fullWidth
                            sx={{ marginRight: "5px" }}
                          />
                          <TextField
                            {...endProps}
                            fullWidth
                            sx={{ marginLeft: "5px" }}
                          />
                        </React.Fragment>
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    fullWidth
                    label="Numele medicului"
                    name="numele_medicului"
                    value={this.state.numele_medicului}
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                  <Autocomplete
                    onChange={(event, newValue) => {
                      this.setState({ diagnostic: newValue["label"] });
                    }}
                    disablePortal
                    name="diagnostic"
                    options={CIMdata}
                    renderInput={(params) => (
                      <TextField {...params} label="Diagnostic" />
                    )}
                  />
                </div>
                <div className="column">
                  <TextField
                    fullWidth
                    value={this.state.instituție}
                    label="Instituție"
                    name="instituție"
                    autoComplete="off"
                    onChange={this.handleChange}
                  />

                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Prescripție"
                    name="prescripție"
                    autoComplete="off"
                    value={this.state.prescripție}
                    onChange={this.handleChange}
                  />
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Detalii"
                    name="detalii"
                    value={this.state.detalii}
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            )}
            <div className="add-medical-event-done-cancel">
              <button
                onClick={() => {
                  this.setState({
                    disabled: true,
                    numele_medicului: "",
                    data: "",
                    prescripție: "",
                    diagnostic: "",
                    instituție: "",
                    detalii: "",
                    perioada: [null, null],
                  });
                }}
              >
                Anulează
              </button>

              <button
                onClick={() => {
                  if (
                    this.state.tipul_evenimentului === "Vizită medic familie" ||
                    this.state.tipul_evenimentului === "Vizită medic specialist"
                  )
                    createMedicalEvent(this.props.currentUser, {
                      tipul_evenimentului: this.state.tipul_evenimentului,
                      numele_medicului: this.state.numele_medicului,
                      data: new Date(this.state.data),
                      prescripție: this.state.prescripție,
                      diagnostic: this.state.diagnostic,
                      instituție: this.state.instituție,
                      detalii: this.state.detalii,
                    });
                  else if (
                    this.state.tipul_evenimentului === "Internare în spital"
                  ) {
                    createMedicalEvent(this.props.currentUser, {
                      tipul_evenimentului: this.state.tipul_evenimentului,
                      numele_medicului: this.state.numele_medicului,
                      prescripție: this.state.prescripție,
                      diagnostic: this.state.diagnostic,
                      instituție: this.state.instituție,
                      detalii: this.state.detalii,
                      perioada: [
                        new Date(this.state.perioada[0]),
                        new Date(this.state.perioada[1]),
                      ],
                    });
                  } else console.log("event type not expected");
                  this.setState({
                    disabled: true,
                    numele_medicului: "",
                    data: "",
                    prescripție: "",
                    diagnostic: "",
                    instituție: "",
                    detalii: "",
                    perioada: [null, null],
                  });
                }}
              >
                Trimite
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="medical-event-filter">
          <div className="medical-event-filter-row">
            <FormControl fullWidth>
              <InputLabel>Tipul evenimentului</InputLabel>
              <Select
                label="Tipul evenimentului"
                native
                defaultValue={"Toate"}
                name="searchEventType"
                onChange={this.handleChange}
              >
                <option value={"Toate"} selected>
                  Toate
                </option>
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

            <TextField
              fullWidth
              label="Numele medicului"
              name="searchMedicName"
              onChange={this.handleChange}
              defaultValue=""
              type="search"
            />
          </div>
          <div className="medical-event-filter-row">
            <TextField
              fullWidth
              label="Anul"
              name="anul"
              onChange={this.handleChange}
              defaultValue=""
              type="search"
            />
            <TextField
              fullWidth
              label="Luna"
              name="luna"
              onChange={this.handleChange}
              defaultValue=""
              type="search"
            />
            <TextField
              fullWidth
              label="Ziua"
              name="ziua"
              onChange={this.handleChange}
              defaultValue=""
              type="search"
            />
          </div>
        </div>
        <div className="medical-events">
          {this.props.currentUser.medicalRecord
            .filter((item) => {
              var data = true;
              var perioada = true;
              if (this.state.anul !== "") {
                if (
                  item.tipul_evenimentului?.includes("Vizită") &&
                  new Date(item.data["seconds"] * 1000).getFullYear() !==
                    parseInt(this.state.anul)
                )
                  data = false;
                if (
                  item.tipul_evenimentului?.includes("Internare") &&
                  (new Date(item.perioada[0]["seconds"] * 1000).getFullYear() >
                    parseInt(this.state.anul) ||
                    new Date(item.perioada[1]["seconds"] * 1000).getFullYear() <
                      parseInt(this.state.anul))
                )
                  perioada = false;
              }

              if (this.state.luna !== "") {
                if (
                  item.tipul_evenimentului?.includes("Vizită") &&
                  new Date(item.data["seconds"] * 1000).getMonth() + 1 !==
                    parseInt(this.state.luna)
                )
                  data = false;
                if (
                  item.tipul_evenimentului?.includes("Internare") &&
                  (new Date(item.perioada[0]["seconds"] * 1000).getMonth() + 1 >
                    parseInt(this.state.luna) ||
                    new Date(item.perioada[1]["seconds"] * 1000).getMonth() +
                      1 <
                      parseInt(this.state.luna))
                )
                  perioada = false;
              }
              if (this.state.ziua !== "") {
                if (
                  item.tipul_evenimentului?.includes("Vizită") &&
                  new Date(item.data["seconds"] * 1000).getDate() !==
                    parseInt(this.state.ziua)
                )
                  data = false;
                if (
                  item.tipul_evenimentului?.includes("Internare") &&
                  (new Date(item.perioada[0]["seconds"] * 1000).getDate() >
                    parseInt(this.state.ziua) ||
                    new Date(item.perioada[1]["seconds"] * 1000).getDate() <
                      parseInt(this.state.ziua))
                )
                  perioada = false;
              }
              if (this.state.searchEventType === "Toate")
                return (
                  data &&
                  perioada &&
                  item.numele_medicului?.includes(this.state.searchMedicName)
                );
              return (
                data &&
                perioada &&
                item.tipul_evenimentului?.includes(
                  this.state.searchEventType
                ) &&
                item.numele_medicului?.includes(this.state.searchMedicName)
              );
            })
            .map((item, index) => {
              return (
                <div key={index} className="medical-event">
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div className="medical-event-row">
                        <p>{key.replace("_", " ")}:&nbsp;</p>
                        <p>
                          {key === "perioada"
                            ? `${new Date(
                                value[0]["seconds"] * 1000
                              ).getFullYear()}/${
                                new Date(
                                  value[0]["seconds"] * 1000
                                ).getMonth() + 1
                              }/${new Date(
                                value[0]["seconds"] * 1000
                              ).getDate()} - ${new Date(
                                value[1]["seconds"] * 1000
                              ).getFullYear()}/${
                                new Date(
                                  value[1]["seconds"] * 1000
                                ).getMonth() + 1
                              }/${new Date(
                                value[1]["seconds"] * 1000
                              ).getDate()}`
                            : key === "data"
                            ? `${new Date(
                                value["seconds"] * 1000
                              ).getFullYear()}/${
                                new Date(value["seconds"] * 1000).getMonth() + 1
                              }/${new Date(value["seconds"] * 1000).getDate()}`
                            : value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PacientProfile);
