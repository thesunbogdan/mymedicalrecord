import React from "react";
import { getPatients } from "../../utils/firebase";
import "./access.styles.scss";
import ProfileCard from "../profile-card/profile-card.component";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

class Access extends React.Component {
  constructor() {
    super();

    this.state = {
      patientsList: [],
      searchField: "",
    };
  }

  componentDidMount() {
    getPatients()
      .then((value) => {
        this.setState({ patientsList: value });
      })
      .catch((err) => {
        alert(err);
      });
  }

  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value });
  };

  render() {
    return (
      <>
        <div className="search-field">
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            autoComplete="off"
            type="search"
            placeholder="Search patient"
            onChange={this.onSearchChange}
          />
        </div>
        <div className="access">
          {this.state.patientsList.length > 0 ? (
            this.state.patientsList
              .filter((patient) =>
                `${patient.firstName} ${patient.lastName}`
                  .toLowerCase()
                  .includes(this.state.searchField.toLowerCase())
              )
              .map((item, index) => {
                return <ProfileCard props={(index, item)} />;
              })
          ) : (
            <p>No patients found.</p>
          )}{" "}
        </div>
      </>
    );
  }
}

export default Access;
