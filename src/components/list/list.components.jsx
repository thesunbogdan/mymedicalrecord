import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { connect } from "react-redux";
import { columns } from "../../utils/patients-list-data";
import { getUsersByRole } from "../../utils/firebase";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

class ListComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      patientsAllowedRaw: [],
      selectedPatients: null,
      data: [
        {
          name: "Page A",
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: "Page B",
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: "Page C",
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: "Page D",
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: "Page E",
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: "Page F",
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: "Page G",
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ],
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
        <ResponsiveContainer width="50%" height="50%">
          <BarChart width={150} height={40} data={this.state.selectedPatients}>
            <XAxis dataKey="lastName" />
            <YAxis />
            <Bar dataKey="age" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ListComponent);
