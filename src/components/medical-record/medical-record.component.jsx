import React, { useState } from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReactModal from "react-modal";
import "./medical-record.styles.scss";
import { FormControl, InputLabel, Select, TextField } from "@mui/material";

const MedicalRecord = (props) => {
  const [show, setShow] = useState(false);
  const [eventType, setEventType] = useState("");
  const [medicName, setMedicName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

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
          },
        }}
      >
        <div className="medical-event-patient-body">
          <button onClick={() => setShow(false)}>Închide</button>
          <div className="medical-event-filter">
            <div className="medical-event-filter-row">
              <FormControl fullWidth>
                <InputLabel>Tipul evenimentului</InputLabel>
                <Select
                  label="Tipul evenimentului"
                  native
                  onChange={(event) => setEventType(event.target.value)}
                  defaultValue={"Toate"}
                >
                  <option value={"Toate"} selected>
                    Toate
                  </option>
                  <option value={"Vizită medic familie"}>
                    Vizită medic familie
                  </option>
                  <option value={"Vizită medic specialist"}>
                    Vizită medic specialist
                  </option>
                  <option value={"Internare în spital"}>
                    Internare în spital
                  </option>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                onChange={(event) => setMedicName(event.target.value)}
                label="Numele medicului"
                name="searchMedicName"
                defaultValue=""
                type="search"
              />
            </div>
            <div className="medical-event-filter-row">
              <TextField
                fullWidth
                onChange={(event) => setYear(event.target.value)}
                label="Anul"
                name="anul"
                defaultValue=""
                type="search"
              />
              <TextField
                onChange={(event) => setMonth(event.target.value)}
                fullWidth
                label="Luna"
                name="luna"
                defaultevent=""
                type="search"
              />
              <TextField
                fullWidth
                onChange={(event) => setDay(event.target.value)}
                label="Ziua"
                name="ziua"
                defaultValue=""
                type="search"
              />
            </div>
          </div>
          {props["props"]
            .filter((item) => {
              var data = true;
              var perioada = true;
              console.log(year);
              if (year !== "") {
                if (
                  item["tipul_evenimentului"]?.includes("Vizită") &&
                  new Date(item["data"]["seconds"] * 1000).getFullYear() !==
                    parseInt(year)
                )
                  data = false;
                if (
                  item["tipul_evenimentului"]?.includes("Internare") &&
                  (new Date(
                    item["perioada"][0]["seconds"] * 1000
                  ).getFullYear() > parseInt(year) ||
                    new Date(
                      item["perioada"][1]["seconds"] * 1000
                    ).getFullYear() < parseInt(year))
                )
                  perioada = false;
              }

              if (month !== "") {
                if (
                  item["tipul_evenimentului"]?.includes("Vizită") &&
                  new Date(item["data"]["seconds"] * 1000).getMonth() + 1 !==
                    parseInt(month)
                )
                  data = false;
                if (
                  item["tipul_evenimentului"]?.includes("Internare") &&
                  (new Date(item["perioada"][0]["seconds"] * 1000).getMonth() +
                    1 >
                    parseInt(month) ||
                    new Date(item["perioada"][1]["seconds"] * 1000).getMonth() +
                      1 <
                      parseInt(month))
                )
                  perioada = false;
              }
              if (day !== "") {
                if (
                  item["tipul_evenimentului"]?.includes("Vizită") &&
                  new Date(item["data"]["seconds"] * 1000).getDate() !==
                    parseInt(day)
                )
                  data = false;
                if (
                  item["tipul_evenimentului"]?.includes("Internare") &&
                  (new Date(item["perioada"][0]["seconds"] * 1000).getDate() >
                    parseInt(day) ||
                    new Date(item["perioada"][1]["seconds"] * 1000).getDate() <
                      parseInt(day))
                )
                  perioada = false;
              }
              if (eventType === "Toate")
                return (
                  data &&
                  perioada &&
                  item["numele_medicului"]?.includes(medicName)
                );

              console.log(
                "data: " +
                  data +
                  "perioada: " +
                  perioada +
                  "includes eventType: " +
                  `${item["tipul_evenimentului"]?.includes(eventType)}` +
                  "includes medicName: " +
                  `${item["numele_medicului"]?.includes(medicName)}`
              );
              return (
                data &&
                perioada &&
                item["tipul_evenimentului"]?.includes(eventType) &&
                item["numele_medicului"]?.includes(medicName)
              );
            })
            .map((item) => (
              <div className="medical-event-patient">
                {Object.entries(
                  Object.keys(item)
                    .sort()
                    .reduce((r, k) => ((r[k] = item[k]), r), {})
                ).map(([key, value]) => (
                  <div className="key-value" key={key}>
                    <p>
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace("_", " ")}
                    </p>{" "}
                    <p>
                      {key === "data"
                        ? `${new Date(value["seconds"] * 1000).getFullYear()}/${
                            new Date(value["seconds"] * 1000).getMonth() + 1
                          }/${new Date(value["seconds"] * 1000).getDate()}`
                        : key === "perioada"
                        ? `${new Date(
                            value[0]["seconds"] * 1000
                          ).getFullYear()}/${
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
        </div>
      </ReactModal>
    </div>
  );
};

export default MedicalRecord;
