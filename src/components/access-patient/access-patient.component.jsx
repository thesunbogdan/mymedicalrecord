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
        <div className="picture-and-age">
          <div className="picture">
            <img
              alt="profile"
              src={
                profilePictureURL ? profilePictureURL : basicProfilePictureURL
              }
            />
          </div>
          <div className="age">
            <p>{medicFunction}</p>
            <p>{medicInstitution}</p>
          </div>
        </div>
        <div className="name-and-buttons">
          <div className="name">
            <h1>{lastName},</h1>
            <h3>{firstName}</h3>
          </div>
          {myPatientsAllowed?.includes(patientId) ? (
            <div className="buttons">
              <p>Has access to your data.</p>
              <button
                onClick={() => {
                  denyAccess(medicId, patientId).then(this.updateUserList);
                }}
              >
                Deny Access
              </button>
            </div>
          ) : myPatientsPending?.includes(patientId) ? (
            <div className="buttons">
              <button
                onClick={() => {
                  acceptRequest(medicId, patientId).then(this.updateUserList);
                }}
              >
                Accept Request
              </button>
              <button
                onClick={() => {
                  cancelRequest(medicId, patientId).then(this.updateUserList);
                }}
              >
                Decline Request
              </button>
            </div>
          ) : (
            <p style={{ zIndex: 200 }}>fasfasfsa</p>
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
      <>
        <div className="textfield">
          {" "}
          <TextField
            placeholder="Cautare medic..."
            sx={{ left: "42%" }}
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

        <div className="access">
          {this.state.usersList
            ?.filter(
              (medic) =>
                medic.myPatientsPending.includes(this.props.currentUser.id) &&
                `${medic.firstName} ${medic.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
            )
            .map((item, index) => {
              console.log("myPatientsPending: " + item);
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
            ?.filter(
              (medic) =>
                medic.myPatientsAllowed.includes(this.props.currentUser.id) &&
                `${medic.firstName} ${medic.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
            )
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(AccessPatient);
