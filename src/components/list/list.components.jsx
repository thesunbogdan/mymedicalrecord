import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { connect } from "react-redux";
import { getUsersByRole } from "../../utils/firebase";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Avatar from "@mui/material/Avatar";
import { basicProfilePictureURL } from "../../utils/basic-profile-picture";
import MedicalRecord from "../../components/medical-record/medical-record.component";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { deletePatient } from "../../utils/firebase";

class ListComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      patientsAllowedRaw: [],
      selectedPatients: null,
    };
  }

  columns = (patients) => {
    if (patients)
      return [
        {
          field: "id",
          headerName: "ID",
          width: 250,
          headerAlign: "left",
          align: "left",
          headerAlign: "center",
          align: "center",
        },
        {
          headerName: "Șterge",
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => {
                deletePatient(params.row.id, this.props.currentUser.id).then(
                  () =>
                    this.setState({
                      patientsAllowedRaw: this.state.patientsAllowedRaw.filter(
                        (item) => item["pacientId"] != params.row.id
                      ),
                    })
                );
              }}
            >
              <DeleteIcon />
            </IconButton>
          ),

          sortable: false,
          filterable: false,
        },
        {
          field: "profilePictureURL",
          headerName: "Avatar",
          width: 70,
          renderCell: (params) => (
            <Avatar
              alt="profile"
              src={
                params.row.profilePictureURL
                  ? params.row.profilePictureURL
                  : basicProfilePictureURL
              }
            />
          ),
        },
        {
          field: "firstName",
          headerName: "Prenume",
          width: 130,
          headerAlign: "center",
          align: "center",
        },
        {
          field: "lastName",
          headerName: "Nume",
          width: 130,
          headerAlign: "center",
          align: "center",
        },
        {
          field: "email",
          headerName: "E-mail",
          width: 200,
          headerAlign: "center",
          align: "center",
        },
        {
          sortable: false,
          filterable: false,
          field: "comorbidities",
          headerName: "Comorbidități",
          width: 200,
          headerAlign: "center",
          align: "center",
          renderCell: (params) => (
            <select>
              <option disabled selected>
                {"Listă de comorbidități"}
              </option>
              {params.row.comorbidities.map((comorbidity) => (
                <option disabled style={{ color: "black" }}>
                  {comorbidity}
                </option>
              ))}
            </select>
          ),
        },
        {
          field: "gen",
          headerName: "Gen",
          width: 130,
          headerAlign: "center",
          align: "center",
        },
        {
          field: "înălțime",
          headerName: "Înălțime",
          width: 130,
          headerAlign: "center",
          align: "center",
          valueFormatter: ({ value }) => {
            if (value) return `${value} cm`;
          },
        },
        {
          field: "greutate",
          headerName: "Greutate",
          width: 130,
          valueFormatter: ({ value }) => {
            if (value) return `${value} kg`;
          },
          headerAlign: "center",
          align: "center",
        },
        {
          field: "tel",
          headerName: "Telephone number",
          headerAlign: "center",
          align: "center",
          width: 200,
        },
        {
          field: "age",
          headerName: "Vârstă",
          type: "number",
          width: 100,
          headerAlign: "center",
          align: "center",
          valueFormatter: ({ value }) => `${value} ani`,
        },
        {
          sortable: false,
          filterable: false,
          field: "medicalRecord",
          headerName: "Istoric medical",
          headerAlign: "center",
          align: "center",
          renderCell: (params) => (
            <MedicalRecord props={params.row.medicalRecord} />
          ),
          width: 150,
        },
      ];
  };

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

  bmi = (patients) => {
    var bmiJSON = [
      { name: "Subponderal", value: 0 },
      {
        name: "Normal",
        value: 0,
      },
      { name: "Supraponderal", value: 0 },
      { name: "Obez", value: 0 },
    ];

    patients.map((patient) => {
      if (patient.greutate && patient.înălțime) {
        const patientBmi =
          patient.greutate /
          ((patient.înălțime / 100) * (patient.înălțime / 100));
        if (patientBmi < 18.5) {
          bmiJSON[0]["value"]++;
        } else if (patientBmi >= 18.5 && patient <= 24.9) {
          bmiJSON[1]["value"]++;
        } else if (patientBmi >= 25 && patientBmi <= 29.9) {
          bmiJSON[2]["value"]++;
        } else {
          bmiJSON[3]["value"]++;
        }
      }
    });
    return bmiJSON;
  };

  gender = (patients) => {
    var genderJSON = [
      {
        name: "Masculin",
        value: 0,
      },
      {
        name: "Feminin",
        value: 0,
      },
    ];

    patients.map((patient) => {
      if (patient.gen) {
        if (patient.gen === "Masculin") {
          genderJSON[0]["value"]++;
        } else {
          genderJSON[1]["value"]++;
        }
      }
    });

    return genderJSON;
  };

  age = (patients) => {
    var ageJSON = [
      { name: "0-2", value: 0 },
      { name: "3-12", value: 0 },
      { name: "13-17", value: 0 },
      { name: "18-29", value: 0 },
      { name: "30-39", value: 0 },
      { name: "40-49", value: 0 },
      { name: "50-64", value: 0 },
      { name: "65+", value: 0 },
    ];

    patients.map(({ age }) => {
      if (age >= 0 && age <= 2) {
        ageJSON[0]["value"]++;
      } else if (age >= 3 && age <= 12) {
        ageJSON[1]["value"]++;
      } else if (age >= 13 && age <= 17) {
        ageJSON[2]["value"]++;
      } else if (age >= 18 && age <= 29) {
        ageJSON[3]["value"]++;
      } else if (age >= 30 && age <= 39) {
        ageJSON[4]["value"]++;
      } else if (age >= 40 && age <= 49) {
        ageJSON[5]["value"]++;
      } else if (age >= 50 && age <= 64) {
        ageJSON[6]["value"]++;
      } else if (age >= 65) {
        ageJSON[7]["value"]++;
      }
    });

    return ageJSON;
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
    console.log(this.state.patientsAllowedRaw);
    return (
      <div style={{ height: "90vh", width: "100%" }}>
        {myPatients ? (
          <DataGrid
            columns={this.columns(myPatients)}
            rows={myPatients}
            disableSelectionOnClick
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

        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={this.bmi(patientsAllowed)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={this.renderCustomizedLabel}
              outerRadius={200}
              fill="#8884d8"
              dataKey="value"
            >
              {this.bmi(patientsAllowed).map((entry, index) => (
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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={this.gender(patientsAllowed)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={this.renderCustomizedLabel}
              outerRadius={200}
              fill="#8884d8"
              dataKey="value"
            >
              {this.gender(patientsAllowed).map((entry, index) => (
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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={this.age(myPatients)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={this.renderCustomizedLabel}
              outerRadius={200}
              fill="#8884d8"
              dataKey="value"
            >
              {this.age(myPatients).map((entry, index) => (
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

        {/* {JSON.stringify(this.state.selectedPatients)} */}
        {/* <p>{JSON.stringify(this.comorbidities(patientsAllowed))}</p> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ListComponent);
