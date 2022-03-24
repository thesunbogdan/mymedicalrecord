import React from "react";
import { getPatients } from "../../utils/firebase";
import "./access.styles.scss";
import ProfileCard from "../profile-card/profile-card.component";

class Access extends React.Component {
  constructor() {
    super();

    this.state = {
      patientsList: null,
    };
  }

  componentDidMount() {
    getPatients()
      .then((value) => {
        if (value) {
          this.setState({ patientsList: value });
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  render() {
    return (
      <div className="access">
        {/* {{console.log(">>>>> " + this.state.patientsList)} */}
        {this.state.patientsList
          ? this.state.patientsList.map((item, index) => {
              return <ProfileCard props={(index, item)} />;
              // console.log("index: " + index);
              // console.log(JSON.stringify(item, null, 2));
              // return (
              //   <div className="access">
              //     {Object.entries(item).map(([key, value]) => {
              //       return (
              //         // <p>
              //         //   {" "}
              //         //   {index} : {key} : {value}
              //         // </p>
              //         <ProfileCard index={index} key={key} value={value} />
              //       );
              //     })}
              //   </div>
              // );
              // <p>{index}</p>;
            })
          : ""}{" "}
      </div>
    );
  }
}

export default Access;
