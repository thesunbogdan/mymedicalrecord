import { Component } from "react";
import { connect } from "react-redux";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";
import TextField from "@mui/material/TextField";
import { cancelRequest, sendRequest } from "../../utils/firebase";
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
    this._isMounted = false;
  }

  ProfileCard = (props) => {
    const {
      firstName,
      lastName,
      profilePictureURL,
      medicId,
      myPatientsPending,
      medicFunction,
      medicInstitution,
    } = props.item;
    const patientId = props.patientId;

    return (
      <div className="profile-card">
        <div className="picture-and-age">
          <div className="picture">
            <img
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

          {myPatientsPending?.filter((item) => item === patientId).length >
          0 ? (
            <div className="buttons">
              <button>Accept Request</button>
              <button
                onClick={() => {
                  if (this._isMounted)
                    cancelRequest(medicId, patientId).then(
                      this._isMounted && this.updateUserList
                    );
                }}
              >
                Decline Request
              </button>
            </div>
          ) : (
            <div className="buttons">
              <button
                onClick={() => {
                  if (this._isMounted)
                    sendRequest(medicId, patientId).then(
                      this._isMounted && this.updateUserList
                    );
                }}
              >
                Request Access
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value });
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) this.updateUserList();
  }

  updateUserList = () => {
    getUsersByRole("Medic", "medicId").then((value) =>
      this.setState({ usersList: value })
    );
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <>
        <div className="textfield">
          {" "}
          <TextField
            sx={{ display: "block", margin: "auto" }}
            autoComplete="off"
            placeholder="Cautare medic..."
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
                medic.myPatientsPending.indexOf(this.props.currentUser.id) >
                  -1 &&
                `${medic.firstName} ${medic.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
            )
            .map((item, index) => {
              return (
                <this.ProfileCard
                  key={index}
                  item={item}
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
