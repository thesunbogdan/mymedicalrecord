import { Component } from "react";
import { getUsersByRole } from "../../utils/firebase";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";
import { connect } from "react-redux";
import { cancelRequest, sendRequest } from "../../utils/firebase";
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
    const {
      firstName,
      lastName,
      profilePictureURL,
      pacientId,
      myMedicsPending,
    } = props.item;
    const medicId = props.medicId;

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
            <p>26 years old</p>
          </div>
        </div>
        <div className="name-and-buttons">
          <div className="name">
            <h1>{lastName},</h1>
            <h3>{firstName}</h3>
          </div>
          <div className="buttons">
            {myMedicsPending?.filter((item) => item === medicId).length > 0 ? (
              <button
                onClick={() => {
                  cancelRequest(medicId, pacientId).then(this.updateUserList);
                }}
              >
                Cancel Request
              </button>
            ) : (
              <button
                onClick={() => {
                  sendRequest(medicId, pacientId).then(this.updateUserList);
                }}
              >
                Request Access
              </button>
            )}
          </div>
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
      <>
        <TextField
          placeholder="Cautare pacient..."
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
        <div className="access">
          {this.state.usersList
            ?.filter((patient) =>
              `${patient.firstName} ${patient.lastName}`
                .toLowerCase()
                .includes(this.state.searchField.toLowerCase())
            )
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(AccessMedic);
