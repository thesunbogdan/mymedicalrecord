import { Component } from "react";
import { connect } from "react-redux";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";
import TextField from "@mui/material/TextField";
import { cancelRequest, acceptRequest, denyAccess } from "../../utils/firebase";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { getUsersByRole } from "../../utils/firebase";
import "../access-medic/access-medic.styles.scss";

class AccessPatient extends Component {
  constructor() {
    super();

    this.state = {
      usersList: null,
      searchField: "",
    };
  }

  ProfileCard = (props) => {
    const {
      firstName,
      lastName,
      profilePictureURL,
      medicId,
      medicFunction,
      medicInstitution,
    } = props.item;

    const patientId = props.patientId;

    if (props.type === "pending") {
      var { myPatientsPending } = props.item;
    } else if (props.type === "allowed") {
      var { myPatientsAllowed } = props.item;
    }

    return (
      <div className="profile-card">
        <div className="first-column">
          <div className="photo-div">
            <img
              alt="poza de profil"
              src={
                profilePictureURL ? profilePictureURL : basicProfilePictureURL
              }
            />
          </div>
          <button
            onClick={async (event) => {
              navigator.clipboard.writeText(medicId);
              event.target.innerHTML = "Copiat";
              await new Promise((res) => setTimeout(res, 1500));
              event.target.innerHTML = "ID: " + medicId;
            }}
            onMouseEnter={(event) => {
              if (event.target.innerHTML !== "Copiat")
                event.target.innerHTML = "Apasă pentru a copia";
            }}
            onMouseLeave={(event) => {
              if (event.target.innerHTML !== "Copiat")
                event.target.innerHTML = "ID: " + medicId;
            }}
            className="id"
          >
            ID: {medicId}
          </button>
        </div>
        <div className="second-column">
          <div>
            <h1>{lastName},</h1>
            <h3>{firstName}</h3>
          </div>
          <h4>{medicInstitution}</h4>
          <h4>{medicFunction}</h4>

          {myPatientsAllowed?.includes(patientId) ? (
            <div className="deny-access">
              <p>Are acces la datele dv.</p>
              <button
                onClick={() => {
                  denyAccess(medicId, patientId).then(this.updateUserList);
                }}
              >
                Blochează acces
              </button>
            </div>
          ) : myPatientsPending?.includes(patientId) ? (
            <div className="buttons">
              <button
                onClick={() => {
                  acceptRequest(medicId, patientId).then(this.updateUserList);
                }}
              >
                Permite acces
              </button>
              <button
                onClick={() => {
                  cancelRequest(medicId, patientId).then(this.updateUserList);
                }}
              >
                Respinge cerere acces
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value });
  };

  componentDidMount() {
    this.updateUserList();
  }

  updateUserList = () => {
    getUsersByRole("Medic", "medicId").then((value) =>
      this.setState({ usersList: value })
    );
  };

  render() {
    return (
      <div className="access-medic">
        <div className="search-div">
          {" "}
          <TextField
            placeholder="Căutare medic"
            type="search"
            onChange={this.onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="profile-cards">
          {this.state.usersList
            ?.filter((medic) => {
              var nameFilter = true;
              var idFilter = true;
              var patientsPending = true;
              if (
                !medic.myPatientsPending.includes(this.props.currentUser.id)
              ) {
                patientsPending = false;
              }

              if (
                !`${medic.firstName} ${medic.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
              ) {
                nameFilter = false;
              }

              if (medic.medicId !== this.state.searchField) {
                idFilter = false;
              }
              return (nameFilter || idFilter) && patientsPending;
            })
            .map((item, index) => {
              return (
                <this.ProfileCard
                  key={index}
                  item={item}
                  type="pending"
                  patientId={this.props.currentUser.id}
                />
              );
            })}

          {this.state.usersList
            ?.filter((medic) => {
              var nameFilter = true;
              var idFilter = true;
              var patientsAllowed = true;
              if (
                !medic.myPatientsAllowed.includes(this.props.currentUser.id)
              ) {
                patientsAllowed = false;
              }

              if (
                !`${medic.firstName} ${medic.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
              ) {
                nameFilter = false;
              }

              if (medic.medicId !== this.state.searchField) {
                idFilter = false;
              }
              return (nameFilter || idFilter) && patientsAllowed;
            })
            .map((item, index) => {
              return (
                <this.ProfileCard
                  key={index}
                  item={item}
                  type="allowed"
                  patientId={this.props.currentUser.id}
                />
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

export default connect(mapStateToProps)(AccessPatient);
