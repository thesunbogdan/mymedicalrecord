import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { connect } from "react-redux";
import { columns } from "../../utils/patients-list-data";
import { getUsersByRole } from "../../utils/firebase";

class ListComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      patientsAllowedRaw: [],
      selectedPatients: null,
    };
  }

  componentDidMount() {
    getUsersByRole("Pacient", "pacientId").then((value) =>
      this.setState({ patientsAllowedRaw: value })
    );
  }

  render() {
    const myPatients = [];
    console.log(this.state.selectedPatients);

    const patientsAllowed = this.state.patientsAllowedRaw?.filter((patient) => {
      return patient.myMedicsAllowed.includes(this.props.currentUser.id);
    });

    const currentYear = new Date().getFullYear();

    patientsAllowed.map((patient) =>
      myPatients.push({
        id: patient.pacientId,
        profilePictureURL: patient.profilePictureURL,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        gender: patient.gender,
        height: patient.height,
        weight: patient.weight,
        tel: patient.tel,
        age: currentYear - patient.pacientBirthDate.toDate().getFullYear(),
        medicalRecord: patient.medicalRecord,
      })
    );

    return (
      <div style={{ height: "90vh", width: "100%" }}>
        {myPatients ? (
          <DataGrid
            columns={columns}
            rows={myPatients}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = myPatients.filter((row) =>
                selectedIDs.has(row.id.toString())
              );
              this.setState({ selectedPatients: selectedRowData });
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ListComponent);
