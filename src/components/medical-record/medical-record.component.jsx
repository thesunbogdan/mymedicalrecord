import React, { useState } from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReactModal from "react-modal";
import "./medical-record.styles.scss";

const MedicalRecord = (props) => {
  const [show, setShow] = useState(false);
  return (
    <div className="medical-record">
      <EventNoteIcon onClick={() => setShow(true)} />
      <ReactModal
        isOpen={show}
        style={{
          overlay: {
            left: `${window.innerWidth < 600 ? "0" : "240px"} `,
            top: "60px",
          },
          content: {
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          },
        }}
      >
        <button onClick={() => setShow(false)}>Închide</button>
        {/* {console.log(JSON.stringify(props["props"], null, 4))} */}
        {/* <p>{typeof props}</p> */}
        {props["props"].map((item) => (
          <div className="medical-event-patient">
            {Object.entries(
              Object.keys(item)
                .sort()
                .reduce((r, k) => ((r[k] = item[k]), r), {})
            ).map(([key, value]) => (
              <div className="key-value" key={key}>
                <p>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                </p>{" "}
                <p>
                  {key === "data"
                    ? `${new Date(value["seconds"] * 1000).getFullYear()}/${
                        new Date(value["seconds"] * 1000).getMonth() + 1
                      }/${new Date(value["seconds"] * 1000).getDate()}`
                    : key === "perioada"
                    ? `${new Date(value[0]["seconds"] * 1000).getFullYear()}/${
                        new Date(value[0]["seconds"] * 1000).getMonth() + 1
                      }/${new Date(
                        value[0]["seconds"] * 1000
                      ).getDate()} - ${new Date(
                        value[1]["seconds"] * 1000
                      ).getFullYear()}/${
                        new Date(value[1]["seconds"] * 1000).getMonth() + 1
                      }/${new Date(value[1]["seconds"] * 1000).getDate()}`
                    : value}
                </p>
              </div>
            ))}
          </div>
        ))}
      </ReactModal>
    </div>
  );
};

export default MedicalRecord;
