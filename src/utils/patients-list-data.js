import Avatar from "@mui/material/Avatar";
import { basicProfilePictureURL } from "./basic-profile-picture";
import MedicalRecord from "../components/medical-record/medical-record.component";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { deletePatient } from "./firebase";

export const columns = [
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
          deletePatient(this.props.currentUser.id, params.row.id);
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
    renderCell: (params) => <MedicalRecord props={params.row.medicalRecord} />,
    width: 150,
  },
];
