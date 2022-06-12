import { Component } from "react";
import { getUsersByRole } from "../../utils/firebase";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";
import { connect } from "react-redux";
import { cancelRequest1, sendRequest } from "../../utils/firebase";
import "./access-medic.styles.scss";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

class AccessMedic extends Component {
  constructor() {
    super();

    this.state = {
      usersList: null,
      searchField: "",
    };
  }

  ProfileCard = (props) => {
    function getAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    const {
      firstName,
      lastName,
      profilePictureURL,
      pacientId,
      myMedicsPending,
      pacientBirthDate,
    } = props.item;
    const medicId = props.medicId;

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
          <div className="id">ID: {pacientId}</div>
        </div>
        <div className="second-column">
          <h1>
            {lastName},<br />
            {firstName}
          </h1>

          <h3>Vârstă: {getAge(pacientBirthDate["seconds"] * 1000)}</h3>
          {myMedicsPending?.filter((item) => item === medicId).length > 0 ? (
            <button
              onClick={() => {
                cancelRequest1(medicId, pacientId).then(this.updateUserList);
              }}
            >
              Cere acces
            </button>
          ) : (
            <button
              onClick={() => {
                sendRequest(medicId, pacientId).then(this.updateUserList);
              }}
            >
              Anulează cerere acces
            </button>
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
    getUsersByRole("Pacient", "pacientId").then((value) =>
      this.setState({ usersList: value })
    );
  };

  render() {
    return (
      <div className="access-medic">
        <div className="search-div">
          <TextField
            placeholder="Căutare pacient"
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
            ?.filter((patient) => {
              console.log(patient);
              var name = true;
              var id = true;
              var myPatients = true;

              if (
                !`${patient.firstName} ${patient.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
              ) {
                name = false;
              }

              if (patient.myMedicsAllowed.includes(this.props.currentUser.id)) {
                myPatients = false;
              }

              if (this.state.searchField !== patient.pacientId) {
                id = false;
              }

              return (id || name) && myPatients;
            })
            .map((item) => {
              return (
                <this.ProfileCard
                  key={item.id}
                  item={item}
                  medicId={this.props.currentUser.id}
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

export default connect(mapStateToProps)(AccessMedic);
