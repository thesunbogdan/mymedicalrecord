import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { connect } from "react-redux";
import { columns } from "../../utils/patients-list-data";
import { getUsersByRole } from "../../utils/firebase";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

class ListComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      patientsAllowedRaw: [],
      selectedPatients: null,
    };
  }

  COLORS = [
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#39393A",
    "#A594F9",
    "#56203D",
    "#B10F2E",
    "#132E32",
    "#348AA7",
    "#A77E58",
  ];

  comorbidities = (patients) => {
    var comorbiditiesJSON = [
      { name: "Obezitate", value: 0 },
      { name: "Diabet", value: 0 },
      { name: "Hipertensiune arterială", value: 0 },
      { name: "Insuficiența cardiacă", value: 0 },
      { name: "Astm cronic", value: 0 },
      { name: "Boli pulmonare", value: 0 },
      { name: "Boli autoimune", value: 0 },
      { name: "Boli renale cronice", value: 0 },
      { name: "Boli digestive cronice", value: 0 },
      { name: "Hepatita cronică", value: 0 },
    ];

    patients.map((patient) => {
      patient.comorbidități.map((comorbiditate) => {
        comorbiditiesJSON.map((comorbiditateJSON) => {
          if (comorbiditateJSON["name"] === comorbiditate) {
            comorbiditateJSON["value"]++;
          }
        });
      });
    });
    return comorbiditiesJSON;
  };

  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {percent * 100 ? `${(percent * 100).toFixed(0)}%` : ""}
      </text>
    );
  };

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

    patientsAllowed.map((patient) =>
      myPatients.push({
        id: patient.pacientId,
        profilePictureURL: patient.profilePictureURL,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        gen: patient.gen,
        înălțime: patient.înălțime,
        greutate: patient.greutate,
        tel: patient.tel,
        comorbidities: patient.comorbidități,
        age: JSON.stringify(
          getAge(new Date(patient.pacientBirthDate["seconds"] * 1000))
        ),
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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={this.comorbidities(patientsAllowed)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={this.renderCustomizedLabel}
              outerRadius={200}
              innerRadius={25}
              fill="#8884d8"
              dataKey="value"
            >
              {this.comorbidities(patientsAllowed).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={this.COLORS[index % this.COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={{
                top: "40%",
                left: 0,
                lineHeight: "24px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* <p>{JSON.stringify(this.comorbidities(patientsAllowed))}</p> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ListComponent);
