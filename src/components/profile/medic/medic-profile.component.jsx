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
      orar: {
        luni: this.props.currentUser.orar.luni,
        marti: this.props.currentUser.orar.marti,
        miercuri: this.props.currentUser.orar.miercuri,
        joi: this.props.currentUser.orar.joi,
        vineri: this.props.currentUser.orar.vineri,
        sambata: this.props.currentUser.orar.sambata,
        duminica: this.props.currentUser.orar.duminica,
      },
      specializari: {
        specializare1: this.props.currentUser.specializari.specializare1,
        specializare2: this.props.currentUser.specializari.specializare2,
        specializare3: this.props.currentUser.specializari.specializare3,
      },
      experienta: {
        experienta1: this.props.currentUser.experienta.experienta1,
        experienta2: this.props.currentUser.experienta.experienta2,
        experienta3: this.props.currentUser.experienta.experienta3,
      },
      facultate: this.props.currentUser.facultate,
      anulAbsolvirii: this.props.currentUser.anulAbsolvirii,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleTimetableChange = (event) => {
    const { name, value } = event.target;
    const { orar } = this.state;

    orar[name] = value;
    this.setState({ orar: orar });
  };

  handleExpChange = (event) => {
    const { name, value } = event.target;
    const { experienta } = this.state;

    experienta[name] = value;
    this.setState({ experienta: experienta });
  };

  handleSpecChange = (event) => {
    const { name, value } = event.target;
    const { specializari } = this.state;

    specializari[name] = value;
    this.setState({ specializari: specializari });
  };

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
      orar,
      facultate,
      anulAbsolvirii,
      specializari,
      experienta,
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
          orar,
          facultate,
          anulAbsolvirii,
          specializari,
          experienta,
        }
      );
      this.setState({ showModal: showModal });
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <div className="medic-profile">
        <div className="medic-profile-card">
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
                  size="small"
                  fullWidth
                  autoComplete="off"
                  label="First name"
                  name="firstName"
                  defaultValue={this.props.currentUser.firstName}
                  onChange={this.handleChange}
                />
                <TextField
                  size="small"
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
                <h2>Specializari</h2>
                {Object.keys(this.state.specializari).map((key) => (
                  <TextField
                    onChange={this.handleSpecChange}
                    size="small"
                    name={key}
                    autoComplete="off"
                    fullWidth
                    label={key}
                    defaultValue={this.props.currentUser.specializari[key]}
                  />
                ))}

                <h2>Educatie</h2>
                <TextField
                  size="small"
                  autoComplete="off"
                  name="facultate"
                  label="Facultate"
                  fullWidth
                  defaultValue={this.props.currentUser.facultate}
                  onChange={this.handleChange}
                />

                <TextField
                  size="small"
                  autoComplete="off"
                  name="anulAbsolvirii"
                  label="Anul absolvirii"
                  fullWidth
                  defaultValue={this.props.currentUser.anulAbsolvirii}
                  onChange={this.handleChange}
                />
              </div>
              <div className="modal-column">
                <h2>Experienta</h2>
                {Object.keys(this.state.experienta).map((key) => (
                  <TextField
                    onChange={this.handleExpChange}
                    size="small"
                    name={key}
                    autoComplete="off"
                    fullWidth
                    label={key}
                    defaultValue={this.props.currentUser.experienta[key]}
                  />
                ))}

                <TextField
                  size="small"
                  autoComplete="off"
                  fullWidth
                  label="Medical Function"
                  name="medicFunction"
                  defaultValue={this.props.currentUser.medicFunction}
                  onChange={this.handleChange}
                />
                <TextField
                  size="small"
                  autoComplete="off"
                  fullWidth
                  label="Medical Institution"
                  name="medicInstitution"
                  defaultValue={this.props.currentUser.medicInstitution}
                  onChange={this.handleChange}
                />
                <TextField
                  size="small"
                  autoComplete="off"
                  fullWidth
                  label="Institution Location"
                  name="location"
                  defaultValue={this.props.currentUser.location}
                  onChange={this.handleChange}
                />
                <table>
                  <tbody>
                    <tr>
                      <td colSpan="2">ORAR</td>
                    </tr>
                    <tr>
                      <td>Luni</td>
                      <td>
                        <TextField
                          size="small"
                          name="luni"
                          defaultValue={this.props.currentUser.orar.luni}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Marti</td>
                      <td>
                        {" "}
                        <TextField
                          size="small"
                          name="marti"
                          defaultValue={this.props.currentUser.orar.marti}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Miercuri</td>
                      <td>
                        {" "}
                        <TextField
                          size="small"
                          name="miercuri"
                          defaultValue={this.props.currentUser.orar.miercuri}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Joi</td>
                      <td>
                        {" "}
                        <TextField
                          size="small"
                          name="joi"
                          defaultValue={this.props.currentUser.orar.joi}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Vineri</td>
                      <td>
                        {" "}
                        <TextField
                          size="small"
                          name="vineri"
                          defaultValue={this.props.currentUser.orar.vineri}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Sambata</td>
                      <td>
                        {" "}
                        <TextField
                          size="small"
                          name="sambata"
                          defaultValue={this.props.currentUser.orar.sambata}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Duminica</td>
                      <td>
                        {" "}
                        <TextField
                          size="small"
                          name="duminica"
                          defaultValue={this.props.currentUser.orar.duminica}
                          autoComplete="off"
                          onChange={this.handleTimetableChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

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
          <div className="column">
            <button
              onClick={this.handleOpenModal}
              className="modal-open-button"
            >
              <EditIcon fontSize="small" />
              <p>Modifică</p>
            </button>
            <div className="profile-photo-div">
              <img
                alt="poza de profil"
                className="profile-photo"
                src={`${
                  this.props.currentUser.profilePictureURL
                    ? this.props.currentUser.profilePictureURL
                    : basicProfilePictureURL
                }`}
              />
            </div>

            <div className="fullname-function">
              {this.props.currentUser.firstName}&nbsp;
              {this.props.currentUser.lastName}
            </div>
            <div className="fullname-function">
              {this.props.currentUser.medicFunction}
            </div>
            <div className="id">ID:&nbsp;{this.props.currentUser.id}</div>
          </div>
          <div className="column">
            <div className="contact">
              <div className="dash">
                {this.props.currentUser.medicInstitution}
              </div>
              <div className="dash">
                {" "}
                {this.props.currentUser.location
                  ? this.props.currentUser.location
                  : "(Nu ați adăugat locația instituției)"}
              </div>
              <div className="email-tel">
                <button className="email">
                  {" "}
                  <PhoneIcon />
                  <p>
                    {this.props.currentUser.tel
                      ? this.props.currentUser.tel
                      : "(Nu ați adăugat un număr de telefon)"}
                  </p>
                </button>
                <button className="email">
                  <MailIcon />
                  <p>{this.props.currentUser.email}</p>
                </button>
              </div>
            </div>
            <div className="timetable">
              <h1>Orar</h1>

              <div className="day">
                <p>Luni:</p>
                <p>
                  {this.props.currentUser.orar.luni
                    ? this.props.currentUser.orar.luni
                    : "(Nu a fost completat)"}
                </p>
              </div>
              <div className="day">
                <p>Marți:</p>
                <p>
                  {" "}
                  {this.props.currentUser.orar.marti
                    ? this.props.currentUser.orar.marti
                    : "(Nu a fost completat)"}
                </p>
              </div>
              <div className="day">
                <p>Miercuri:</p>
                <p>
                  {" "}
                  {this.props.currentUser.orar.miercuri
                    ? this.props.currentUser.orar.miercuri
                    : "(Nu a fost completat)"}
                </p>
              </div>
              <div className="day">
                <p>Joi:</p>
                <p>
                  {" "}
                  {this.props.currentUser.orar.joi
                    ? this.props.currentUser.orar.joi
                    : "(Nu a fost completat)"}
                </p>
              </div>
              <div className="day">
                <p>Vineri:</p>
                <p>
                  {" "}
                  {this.props.currentUser.orar.vineri
                    ? this.props.currentUser.orar.vineri
                    : "(Nu a fost completat)"}
                </p>
              </div>
              <div className="day">
                <p>Sâmbătă:</p>
                <p>
                  {" "}
                  {this.props.currentUser.orar.sambata
                    ? this.props.currentUser.orar.sambata
                    : "(Nu a fost completat)"}
                </p>
              </div>
              <div className="day">
                <p>Duminică:</p>
                <p>
                  {" "}
                  {this.props.currentUser.orar.duminica
                    ? this.props.currentUser.orar.duminica
                    : "(Nu a fost completat)"}
                </p>
              </div>
            </div>
          </div>

          <div className="column">
            <div className="education">
              <div className="dash">
                <p>Facultate:</p>
                <p>
                  {this.props.currentUser.facultate
                    ? this.props.currentUser.facultate
                    : "(Nu ați adăugat facultatea)"}
                </p>
              </div>
              <div className="dash">
                <p>Anul absolvirii:</p>
                <p>
                  {this.props.currentUser.anulAbsolvirii
                    ? this.props.currentUser.anulAbsolvirii
                    : "(Nu ați adăugat anul absolvirii)"}
                </p>
              </div>
            </div>
            <div className="exp">
              <div className="vertical">Specializări</div>
              <div className="list">
                {Object.entries(this.props.currentUser.specializari).map(
                  ([key, value]) => (
                    <p>{value ? value : "-"}</p>
                  )
                )}
                {/* {JSON.stringify(this.props.currentUser.specializari)} */}
              </div>
            </div>
            <div className="exp">
              <div className="vertical">Experiență</div>
              <div className="list">
                {Object.entries(this.props.currentUser.experienta).map(
                  ([key, value]) => (
                    <p>{value ? value : "-"}</p>
                  )
                )}
              </div>
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
