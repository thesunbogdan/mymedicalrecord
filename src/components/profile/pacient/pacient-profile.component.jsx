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
                  label="Greutate"
                  name="greutate"
                  defaultValue={this.props.currentUser.greutate}
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
                  label="Înălțime"
                  name="înălțime"
                  defaultValue={this.props.currentUser.înălțime}
                  onChange={this.handleChange}
                />
                <FormControl sx={{ m: 1 }} fullWidth>
                  <InputLabel>Comorbidități</InputLabel>
                  <Select
                    multiple
                    value={this.state.comorbidități}
                    onChange={this.handleMultipleSelectChange}
                    input={<OutlinedInput />}
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
                <FormControl fullWidth>
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
                  Înălțime:{" "}
                  {this.props.currentUser.înălțime
                    ? `${this.props.currentUser.înălțime} cm`
                    : "(Nu ați adăugat înălțimea)"}
                </p>
                <p>
                  Greutate:{" "}
                  {this.props.currentUser.greutate
                    ? `${this.props.currentUser.greutate} kg`
                    : "(Nu ați adăugat greutatea)"}
                </p>
                <p>
                  Gen:{" "}
                  {this.props.currentUser.gen
                    ? this.props.currentUser.gen
                    : "(Nu ați adăugat genul)"}
                </p>
                <p>
                  Vârsta:{" "}
                  {new Date().getFullYear() -
                    this.props.currentUser.pacientBirthDate
                      .toDate()
                      .getFullYear()}{" "}
                  ani
                </p>
                <p>
                  Comorbidități:{" "}
                  {this.props.currentUser.comorbidități ? (
                    this.props.currentUser.comorbidități.map((com) => (
                      <>
                        {com}
                        &nbsp;
                      </>
                    ))
                  ) : (
                    <p>Nu prezintă comorbidități</p>
                  )}
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
          {this.state.tipul_evenimentului === "Vizită medic familie" ||
          this.state.tipul_evenimentului === "Vizită medic specialist" ? (
            <>
              <div className="column">
                <FormControl fullWidth>
                  <InputLabel>Tipul evenimentului</InputLabel>
                  <Select
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
                <FormControl sx={{ m: 1 }} fullWidth>
                  <InputLabel>Diagnostic</InputLabel>
                  <Select
                    onChange={this.handleChange}
                    native
                    name="diagnostic"
                    value={this.state.diagnostic}
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
            </>
          ) : (
            <>
              <div className="column">
                <FormControl fullWidth>
                  <InputLabel>Tipul evenimentului</InputLabel>
                  <Select
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
                        <TextField {...startProps} />
                        <TextField {...endProps} />
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
                <FormControl sx={{ m: 1 }} fullWidth>
                  <InputLabel>Diagnostic</InputLabel>
                  <Select
                    onChange={this.handleChange}
                    native
                    name="diagnostic"
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
              CANCEL
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
              DONE
            </button>
          </div>
        )}
        {/* <p>{JSON.stringify(this.state)}</p> */}
        <FormControl>
          <InputLabel>Tipul evenimentului</InputLabel>
          <Select
            native
            name="searchEventType"
            onChange={this.handleChange}
            defaultValue={""}
          >
            <option value={""}>Toate</option>
            <option value={"Vizită medic familie"}>Vizită medic familie</option>
            <option value={"Vizită medic specialist"}>
              Vizită medic specialist
            </option>
            <option value={"Internare în spital"}>Internare în spital</option>
          </Select>
        </FormControl>
        <TextField
          label="Numele medicului"
          name="searchMedicName"
          onChange={this.handleChange}
          defaultValue=""
          type="search"
        />
        <TextField
          label="Anul"
          name="anul"
          onChange={this.handleChange}
          defaultValue=""
          type="search"
        />
        <TextField
          label="Luna"
          name="luna"
          onChange={this.handleChange}
          defaultValue=""
          type="search"
        />
        <TextField
          label="Ziua"
          name="ziua"
          onChange={this.handleChange}
          defaultValue=""
          type="search"
        />
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
                  new Date(item.perioada[1]["seconds"] * 1000).getMonth() + 1 <
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
            return (
              data &&
              perioada &&
              item.tipul_evenimentului?.includes(this.state.searchEventType) &&
              item.numele_medicului?.includes(this.state.searchMedicName)
            );
          })
          .map((item, index) => {
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
                        {key === "perioada"
                          ? `${new Date(
                              value[0]["seconds"] * 1000
                            ).getFullYear()}/${
                              new Date(value[0]["seconds"] * 1000).getMonth() +
                              1
                            }/${new Date(
                              value[0]["seconds"] * 1000
                            ).getDate()} - ${new Date(
                              value[1]["seconds"] * 1000
                            ).getFullYear()}/${
                              new Date(value[1]["seconds"] * 1000).getMonth() +
                              1
                            }/${new Date(value[1]["seconds"] * 1000).getDate()}`
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
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PacientProfile);
