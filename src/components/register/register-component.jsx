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
      role,
      medicInstitution,
      medicFunction,
      pacientBirthDate,
    } = this.state;

    if (password !== confirmPassword) {
      alert("passwords don't match");
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
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
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
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
                        required
                        fullWidth
                        id="institution"
                        label="Institution"
                        name="medicInstitution"
                        value={this.state.medicInstitution}
                        onChange={this.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="function"
                        label="Function"
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
                        label="Birth date"
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
                Register
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Login
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
