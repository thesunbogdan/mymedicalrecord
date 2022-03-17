import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth, createUserProfileDocument } from "./utils/firebase";
import Login from "./components/login/login-component";
import Register from "./components/register/register-component";
import Main from "./pages/main/main.page";
import { connect } from "react-redux";
import { setCurrentUser } from "./redux/user/user.actions";

class App extends React.Component {

  constructor() {
    super();
  }
  
  unSubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unSubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        console.log("!!!!!!!!!!!! " + userAuth.uid);
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else {
        setCurrentUser(userAuth);
      }
    });
  }

  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }
  render() {
    return (
      <div>
        <Routes>
          <Route
            path="/*"
            element={
              this.props.currentUser ? <Main /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={
              this.props.currentUser ? <Navigate to={`/${this.props.currentUser.id}`} /> : <Login />
            }
          />
          <Route
            exact
            path="/register"
            element={
              this.props.currentUser ? <Navigate to={`/${this.props.currentUser.id}`} /> : <Register />
            }
          />
        </Routes>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
