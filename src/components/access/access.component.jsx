import React from "react";
import { getPatients } from "../../utils/firebase";
import "./access.styles.scss";

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
      <>
        {/* {{console.log(">>>>> " + this.state.patientsList)} */}
        {this.state.patientsList
          ? this.state.patientsList.map((item, index) => {
              // console.log("index: " + index);
              // console.log(JSON.stringify(item, null, 2));
              return (
                <div className="access">
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <p>
                        {" "}
                        {index} : {key} : {value}
                      </p>
                    );
                  })}
                </div>
              );
              // <p>{index}</p>;
            })
          : ""}{" "}
      </>
    );
  }
}

export default Access;
