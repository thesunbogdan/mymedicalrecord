import Avatar from "@mui/material/Avatar";
import { basicProfilePictureURL } from "./basic-profile-picture";
import EventNoteIcon from "@mui/icons-material/EventNote";
import swal from "sweetalert";
import MedicalRecord from "../components/medical-record/medical-record.component";

export const columns = [
  { field: "id", headerName: "ID", width: 100 },
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
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  { field: "email", headerName: "E-mail", width: 200 },
  { field: "gender", headerName: "Gender", width: 130 },
  {
    field: "height",
    headerName: "Height",
    width: 130,
    valueFormatter: ({ value }) => {
      if (value) return `${value} cm`;
    },
  },
  {
    field: "weight",
    headerName: "Weight",
    width: 130,
    valueFormatter: ({ value }) => `${value} kg`,
  },
  { field: "tel", headerName: "Telephone number", width: 200 },
  { field: "age", headerName: "Age", type: "number", width: 100 },
  {
    field: "medicalRecord",
    headerName: "Medical record",
    renderCell: (params) => <MedicalRecord props={params.row.medicalRecord} />,
    width: 150,
  },
];
