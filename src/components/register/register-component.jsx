import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import { auth, createUserProfileDocument } from "../../utils/firebase";

const theme = createTheme();

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      medicInstitution: "",
      medicFunction: "",
      pacientBirthDate: "",
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleChange1 = (newValue) => {
    this.setState({ pacientBirthDate: newValue });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      medicInstitution,
      medicFunction,
      pacientBirthDate,
      role,
    } = this.state;

    if (this.state.password.length < 8) {
      alert("Parola trebuie sa conțină minim 8 caractere");
      return;
    }

    if (this.state.password.length > 20) {
      alert("Parola trebuie sa conțină maxim 20 de caractere");
    }

    if (password !== confirmPassword) {
      alert("Parolele nu se potrivesc");
      return;
    }

    if (
      !this.state.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      alert("Email incorect");
      return;
    }

    if (this.state.firstName === 31) {
      alert("Maxim 30 de caractere pentru prenume");
      return;
    }

    if (this.state.firstName === "") {
      alert("Nu ați completat prenumele");
      return;
    }

    if (this.state.lastName === "") {
      alert("Nu ați completat numele");
      return;
    }

    if (this.state.lastName === 21) {
      alert("Maxim 20 de caractere pentru nume");
      return;
    }

    if (this.state.role === "") {
      alert("Nu ați ales rolul");
      return;
    }

    if (this.state.role === "Pacient" && this.state.pacientBirthDate === "") {
      alert("Nu ați completat data de naștere");
      return;
    }
    if (
      this.state.role === "Medic" &&
      (this.state.medicInstitution === "" || this.state.medicFunction === "")
    ) {
      alert("Nu ați completat toate campurile aferente medicului");
      return;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (role === "Pacient") {
        await createUserProfileDocument(user, {
          firstName,
          lastName,
          role,
          pacientBirthDate,
        });
      } else if (role === "Medic") {
        await createUserProfileDocument(user, {
          firstName,
          lastName,
          role,
          medicInstitution,
          medicFunction,
        });
      }
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        medicInstitution: "",
        medicFunction: "",
        pacientBirthDate: "",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Înregistrare
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={this.handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="off"
                    inputProps={{ maxLength: 31 }}
                    name="firstName"
                    error={this.state.firstName.length === 31}
                    helperText={
                      this.state.firstName.length === 31
                        ? "Maxim 30 de caractere"
                        : ""
                    }
                    required
                    fullWidth
                    id="firstName"
                    label="Prenume"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.lastName.length === 21}
                    helperText={
                      this.state.lastName.length === 21
                        ? "Maxim 20 de caractere"
                        : ""
                    }
                    inputProps={{ maxLength: 21 }}
                    autoComplete="off"
                    required
                    fullWidth
                    id="lastName"
                    label="Nume"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    required
                    fullWidth
                    id="email"
                    error={
                      this.state.email !== "" &&
                      !this.state.email
                        .toLowerCase()
                        .match(
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                    }
                    helperText={
                      this.state.email !== "" &&
                      !this.state.email
                        .toLowerCase()
                        .match(
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                        ? "Email incorect"
                        : ""
                    }
                    label="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    required
                    fullWidth
                    name="password"
                    error={this.state.password.length < 8}
                    helperText={
                      this.state.password.length < 8
                        ? "Parola trebuie sa conțină minim 8 caractere"
                        : ""
                    }
                    label="Parola"
                    type="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    required
                    fullWidth
                    error={this.state.confirmPassword !== this.state.password}
                    helperText={
                      this.state.confirmPassword !== this.state.password
                        ? "Parolele nu se potrivesc"
                        : ""
                    }
                    name="confirmPassword"
                    label="Confirmarea parolei"
                    type="password"
                    id="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioGroup
                    row
                    aria-label="role"
                    name="role"
                    style={{ display: "flex", justifyContent: "space-around" }}
                    value={this.state.role}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Medic"
                      control={<Radio />}
                      label="Medic"
                    />
                    <FormControlLabel
                      value="Pacient"
                      control={<Radio />}
                      label="Pacient"
                    />
                  </RadioGroup>
                </Grid>
                {this.state.role === "Medic" ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        error={this.state.medicInstitution.length === 41}
                        helperText={
                          this.state.lastName.length === 41
                            ? "Maxim 40 de caractere"
                            : ""
                        }
                        inputProps={{ maxLength: 41 }}
                        autoComplete="off"
                        required
                        fullWidth
                        id="institution"
                        label="Instituție medicală"
                        name="medicInstitution"
                        value={this.state.medicInstitution}
                        onChange={this.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={this.state.medicInstitution.length === 26}
                        helperText={
                          this.state.lastName.length === 26
                            ? "Maxim 26 de caractere"
                            : ""
                        }
                        inputProps={{ maxLength: 26 }}
                        autoComplete="off"
                        required
                        fullWidth
                        id="function"
                        label="Funcție"
                        name="medicFunction"
                        value={this.state.medicFunction}
                        onChange={this.handleChange}
                      />
                    </Grid>
                  </>
                ) : this.state.role === "Pacient" ? (
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker
                        label="Data de naștere"
                        inputFormat="dd/MM/yyyy"
                        value={this.state.pacientBirthDate}
                        onChange={this.handleChange1}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                ) : null}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Înregistrare
              </Button>
              <p>{this.state.role}</p>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Aveți deja cont? Conectați-vă
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
