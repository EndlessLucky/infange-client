// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import EventIcon from "@material-ui/icons/Event";
// import moment from "moment";
// import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
// import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
// import IconButton from "@material-ui/core/IconButton";
// import FilterIcon from "@material-ui/icons/FilterList";
// import FilterOptions from "../containers/Objective/FilterObjectives";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Checkbox from "@material-ui/core/Checkbox";
// import DateFilter from "./DateFilter";

// const day = new Date().getDay(),
//   startDiff = new Date().getDate() - day,
//   endDiff = new Date().getDate() + 6 - day;
// const MeetingsObjectivesSideBar = ({
//   objectives,
//   onSelect,
//   editObjective,
//   organizations,
//   onFilterChange,
//   selectedObj,
// }) => {
//   const [startDate, setStartDate] = useState(
//     new Date(new Date().setDate(startDiff))
//   );
//   const [endDate, setEndDate] = useState(new Date(new Date().setDate(endDiff)));
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [filters, setFilters] = useState({});
//   const [selectedObjective, setSelectedObjective] = useState(null);
//   const [checked, setChecked] = React.useState(false);

//   const onChange = (dates) => {
//     const [start, end] = dates;
//     const day = new Date(start).getDay(),
//       startDiff = new Date(start).getDate() - day,
//       endDiff = new Date(start).getDate() + 6 - day;
//     setStartDate(new Date(new Date(start).setDate(startDiff)));
//     setEndDate(new Date(new Date(start).setDate(endDiff)));
//     getFirstNote([
//       new Date(new Date(start).setDate(startDiff)),
//       new Date(new Date(start).setDate(endDiff)),
//     ]);
//   };

//   // useEffect(()=>{
//   //     if(selectedObj && selectedObj._id != selectedObjective){
//   //         setSelectedObjective(selectedObj._id)
//   //         onChange([selectedObj.dueDate])
//   //     }
//   // },[selectedObj])

//   const getFirstNote = (dates) => {
//     const sortedObjectives = objectives.sort(
//       (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
//     );
//     const obj = sortedObjectives.find(
//       (i) =>
//         new Date(i.dueDate).getTime() >=
//           new Date(dates[0].setHours(0, 0, 0)).getTime() &&
//         new Date(i.dueDate).getTime() <
//           new Date(dates[1].setHours(23, 59, 59)).getTime()
//     );
//     onSelect(obj);
//   };

//   useEffect(() => {
//     if (selectedObj && selectedObj._id != selectedObjective) {
//       setSelectedObjective(selectedObj._id);
//       onChange([selectedObj.dueDate]);
//     }
//   }, [selectedObj]);

//   const handleOnClick = (e) => {
//     e.stopPropagation();
//     setSelectedObjective(e.target.id);
//     const selectedObj = objectives.find((obj) => obj._id == e.target.id);
//     onSelect(selectedObj);
//   };

//   const handleLeftArrow = () => {
//     let newStartDate = new Date(startDate),
//       newEndDate = new Date(endDate);
//     newStartDate.setDate(newStartDate.getDate() - 7);
//     newEndDate.setDate(newEndDate.getDate() - 7);
//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//     getFirstNote([new Date(newStartDate), new Date(newEndDate)]);
//   };

//   const handleRightArrow = () => {
//     let newStartDate = new Date(startDate),
//       newEndDate = new Date(endDate);
//     newStartDate.setDate(newStartDate.getDate() + 7);
//     newEndDate.setDate(newEndDate.getDate() + 7);
//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//     getFirstNote([new Date(newStartDate), new Date(newEndDate)]);
//   };

//   const handleCheckBox = async (e, obj) => {
//     e.stopPropagation();
//     const isChecked = !e.target.checked;
//     let newObjective = {
//       ...obj,
//       status: isChecked ? "InProgress" : "Completed",
//     };
//     await editObjective(newObjective);
//     setChecked(!isChecked);
//   };
//   return (
//     <div
//       style={{
//         borderRight: "1px solid #bdbdbd",
//         width: "300px",
//         height: "calc(100vh - 64px)",
//       }}
//     >
//       <DateFilter
//         handleLeftArrow={handleLeftArrow}
//         handleRightArrow={handleRightArrow}
//         onFilterClick={() => setFilterOpen(!filterOpen)}
//         startDate={startDate}
//         endDate={endDate}
//         // onEventIconClick={onClick}
//         onDateChange={onChange}
//         filterOpen={filterOpen}
//         onFilterClose={() => setFilterOpen(false)}
//         onFilterChange={onFilterChange}
//         organizations={organizations}
//         objectives={true}
//       />
//       <div style={{ overflowY: "auto", height: "calc(100vh - 112px)" }}>
//         <h4 style={{ marginLeft: "10px" }}>DUE BY:</h4>
//         {[0, 1, 2, 3, 4, 5, 6].map((day) => {
//           let objs = [];
//           if (objectives.length > 0)
//             objs =
//               objectives.filter(
//                 (ob) =>
//                   new Date(ob.dueDate).getTime() >
//                     new Date(
//                       moment.utc(startDate).add(day, "days").format()
//                     ).getTime() &&
//                   new Date(ob.dueDate).getTime() <
//                     new Date(
//                       moment
//                         .utc(startDate)
//                         .add(day + 1, "days")
//                         .format()
//                     ).getTime()
//               ) || [];
//           return (
//             <div>
//               <div
//                 style={{
//                   background:
//                     moment
//                       .utc(startDate)
//                       .add(day, "days")
//                       .local()
//                       .format("DDMMYYYY") == moment().format("DDMMYYYY")
//                       ? "#7169A3"
//                       : "#F0EFF8",
//                   padding: 10,
//                   display: "flex",
//                   justifyContent: "center",
//                   marginTop: "10px",
//                 }}
//               >
//                 <span>
//                   {moment(new Date(startDate))
//                     .add(day, "days")
//                     .format("dddd, MMMM DD")}
//                 </span>
//               </div>
//               {objs.map((obj) => {
//                 if (obj._id == selectedObjective)
//                   if (new Date(obj.dueDate).getTime() < new Date().getTime())
//                     return (
//                       <div>
//                         <div
//                           id={obj._id}
//                           style={{
//                             margin: 10,
//                             border: "1px solid #FF0000",
//                             borderRadius: 5,
//                           }}
//                           onClick={(event) => handleOnClick(event)}
//                         >
//                           <Card
//                             id={obj._id}
//                             style={{ background: "#807AA5", color: "#fff" }}
//                           >
//                             <CardContent
//                               id={obj._id}
//                               style={{ display: "flex" }}
//                             >
//                               <Checkbox
//                                 checked={
//                                   obj.status == "Completed" ? true : false
//                                 }
//                                 onClick={(e) => handleCheckBox(e, obj)}
//                                 defaultChecked
//                                 color="primary"
//                                 inputProps={{
//                                   "aria-label": "secondary checkbox",
//                                 }}
//                               />
//                               <div id={obj._id}>
//                                 <h3 id={obj._id}>{obj.description}</h3>
//                                 <div id={obj._id} style={{ display: "flex" }}>
//                                   <p id={obj._id} style={{ marginRight: 10 }}>
//                                     {obj.status}
//                                   </p>
//                                   <p id={obj._id} style={{ marginLeft: 10 }}>
//                                     Date:
//                                     {moment(obj.dueDate).format("MM/DD/YY")}
//                                   </p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                       </div>
//                     );
//                   else
//                     return (
//                       <div style={{ marginTop: 10 }}>
//                         <div
//                           id={obj._id}
//                           onClick={(event) => handleOnClick(event)}
//                           style={{
//                             margin: 10,
//                             border: "1px solid #e0e0e0",
//                             borderRadius: 5,
//                           }}
//                         >
//                           <Card
//                             id={obj._id}
//                             style={{ background: "#807AA5", color: "#fff" }}
//                           >
//                             <CardContent
//                               id={obj._id}
//                               style={{ display: "flex" }}
//                             >
//                               <Checkbox
//                                 checked={
//                                   obj.status == "Completed" ? true : false
//                                 }
//                                 onClick={(e) => handleCheckBox(e, obj)}
//                                 defaultChecked
//                                 color="primary"
//                                 inputProps={{
//                                   "aria-label": "secondary checkbox",
//                                 }}
//                               />
//                               <div id={obj._id}>
//                                 <h3 id={obj._id}>{obj.description}</h3>
//                                 <div id={obj._id} style={{ display: "flex" }}>
//                                   <p id={obj._id} style={{ marginRight: 10 }}>
//                                     {obj.status}
//                                   </p>
//                                   <p id={obj._id} style={{ marginLeft: 10 }}>
//                                     Date:
//                                     {moment(obj.dueDate).format("MM/DD/YY")}
//                                   </p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                       </div>
//                     );
//                 else if (new Date(obj.dueDate).getTime() < new Date().getTime())
//                   return (
//                     <div>
//                       <div
//                         id={obj._id}
//                         style={{
//                           margin: 10,
//                           border: "1px solid #FF0000",
//                           borderRadius: 5,
//                         }}
//                         onClick={(event) => handleOnClick(event)}
//                       >
//                         <Card id={obj._id}>
//                           <CardContent id={obj._id} style={{ display: "flex" }}>
//                             <Checkbox
//                               checked={obj.status == "Completed" ? true : false}
//                               onClick={(e) => handleCheckBox(e, obj)}
//                               defaultChecked
//                               color="primary"
//                               inputProps={{
//                                 "aria-label": "secondary checkbox",
//                               }}
//                             />
//                             <div id={obj._id}>
//                               <h3 id={obj._id}>{obj.description}</h3>
//                               <div id={obj._id} style={{ display: "flex" }}>
//                                 <p id={obj._id} style={{ marginRight: 10 }}>
//                                   {obj.status}
//                                 </p>
//                                 <p id={obj._id} style={{ marginLeft: 10 }}>
//                                   Date:{moment(obj.dueDate).format("MM/DD/YY")}
//                                 </p>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     </div>
//                   );
//                 else
//                   return (
//                     <div style={{ marginTop: 10 }}>
//                       <div
//                         id={obj._id}
//                         onClick={(event) => handleOnClick(event)}
//                         style={{
//                           margin: 10,
//                           border: "1px solid #e0e0e0",
//                           borderRadius: 5,
//                         }}
//                       >
//                         <Card id={obj._id}>
//                           <CardContent id={obj._id} style={{ display: "flex" }}>
//                             <Checkbox
//                               checked={obj.status == "Completed" ? true : false}
//                               onClick={(e) => handleCheckBox(e, obj)}
//                               defaultChecked
//                               color="primary"
//                               inputProps={{
//                                 "aria-label": "secondary checkbox",
//                               }}
//                             />
//                             <div id={obj._id}>
//                               <h3 id={obj._id}>{obj.description}</h3>
//                               <div id={obj._id} style={{ display: "flex" }}>
//                                 <p id={obj._id} style={{ marginRight: 10 }}>
//                                   {obj.status}
//                                 </p>
//                                 <p id={obj._id} style={{ marginLeft: 10 }}>
//                                   Date:{moment(obj.dueDate).format("MM/DD/YY")}
//                                 </p>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     </div>
//                   );
//               })}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default MeetingsObjectivesSideBar;

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import EventIcon from "@material-ui/icons/Event";
import moment from "moment";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import FilterOptions from "../containers/Objective/FilterObjectives";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import DateFilter from "./DateFilter";

const day = new Date().getDay(),
  startDiff = new Date().getDate() - day,
  endDiff = new Date().getDate() + 6 - day;
const MeetingsObjectivesSideBar = ({
  objectives,
  onSelect,
  editObjective,
  organizations,
  onFilterChange,
  selectedObj,
}) => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(startDiff))
  );
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(endDiff)));
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [checked, setChecked] = React.useState(false);

  const onChange = (dates) => {
    const [start, end] = dates;
    const day = new Date(start).getDay(),
      startDiff = new Date(start).getDate() - day,
      endDiff = new Date(start).getDate() + 6 - day;
    setStartDate(new Date(new Date(start).setDate(startDiff)));
    setEndDate(new Date(new Date(start).setDate(endDiff)));
    getFirstNote([
      new Date(new Date(start).setDate(startDiff)),
      new Date(new Date(start).setDate(endDiff)),
    ]);
  };

  const getFirstNote = (dates) => {
    const sortedObjectives = objectives.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    const obj = sortedObjectives.find(
      (i) =>
        new Date(i.dueDate).getTime() >=
          new Date(dates[0].setHours(0, 0, 0)).getTime() &&
        new Date(i.dueDate).getTime() <
          new Date(dates[1].setHours(23, 59, 59)).getTime()
    );
    if (obj) onSelect(obj);
  };

  useEffect(() => {
    if (selectedObj && selectedObj._id != selectedObjective) {
      setSelectedObjective(selectedObj._id);
      onChange([selectedObj.dueDate]);
    }
  }, [selectedObj]);

  const handleOnClick = (e) => {
    e.stopPropagation();
    setSelectedObjective(e.target.id);
    const selectedObj = objectives.find((obj) => obj._id == e.target.id);
    onSelect(selectedObj);
  };

  const handleLeftArrow = () => {
    let newStartDate = new Date(startDate),
      newEndDate = new Date(endDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    newEndDate.setDate(newEndDate.getDate() - 7);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    getFirstNote([new Date(newStartDate), new Date(newEndDate)]);
  };

  const handleRightArrow = () => {
    let newStartDate = new Date(startDate),
      newEndDate = new Date(endDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    newEndDate.setDate(newEndDate.getDate() + 7);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    getFirstNote([new Date(newStartDate), new Date(newEndDate)]);
  };

  const handleCheckBox = async (e, obj) => {
    e.stopPropagation();
    const isChecked = !e.target.checked;
    let newObjective = {
      ...obj,
      status: isChecked ? "InProgress" : "Completed",
    };
    await editObjective(newObjective);
    setChecked(!isChecked);
  };
  return (
    <div
      style={{
        borderRight: "1px solid #bdbdbd",
        width: "300px",
        height: "calc(100vh - 64px)",
      }}
    >
      <DateFilter
        handleLeftArrow={handleLeftArrow}
        handleRightArrow={handleRightArrow}
        onFilterClick={() => setFilterOpen(!filterOpen)}
        startDate={startDate}
        endDate={endDate}
        // onEventIconClick={onClick}
        onDateChange={onChange}
        filterOpen={filterOpen}
        onFilterClose={() => setFilterOpen(false)}
        onFilterChange={onFilterChange}
        organizations={organizations}
        objectives={true}
      />
      <div style={{ overflowY: "auto", height: "calc(100vh - 112px)" }}>
        <h4 style={{ marginLeft: "10px" }}>DUE BY:</h4>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          let objs = [];
          if (objectives.length > 0)
            objs =
              objectives.filter(
                (ob) =>
                  new Date(ob.dueDate).getTime() >
                    new Date(
                      moment
                        .utc(startDate)
                        .add(day, "days")
                        .startOf("day")
                        .format()
                    ).getTime() &&
                  new Date(ob.dueDate).getTime() <
                    new Date(
                      moment
                        .utc(startDate)
                        .add(day + 1, "days")
                        .startOf("day")
                        .format()
                    ).getTime()
              ) || [];
          return (
            <div>
              <div
                style={{
                  background: "#e0e0e0",
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <span>
                  {moment(new Date(startDate))
                    .add(day, "days")
                    .format("dddd, MMMM DD")}
                </span>
              </div>
              {objs.map((obj) => {
                if (obj._id == selectedObjective)
                  if (new Date(obj.dueDate).getTime() < new Date().getTime())
                    return (
                      <div>
                        <div
                          id={obj._id}
                          style={{
                            margin: 10,
                            border: "1px solid red",
                            borderRadius: 5,
                          }}
                          onClick={(event) => handleOnClick(event)}
                        >
                          <Card
                            id={obj._id}
                            style={{ background: "#7986cb", color: "#fff" }}
                          >
                            <CardContent id={obj._id}>
                              <div id={obj._id}>
                                <div style={{ display: "flex" }}>
                                  <Checkbox
                                    checked={
                                      obj.status == "Completed" ? true : false
                                    }
                                    onClick={(e) => handleCheckBox(e, obj)}
                                    defaultChecked
                                    color="primary"
                                    inputProps={{
                                      "aria-label": "secondary checkbox",
                                    }}
                                    style={{ padding: 0, color: "#fff" }}
                                  />
                                  <h4
                                    style={{ margin: 0, paddingLeft: 10 }}
                                    id={obj._id}
                                  >
                                    {obj.description}
                                  </h4>
                                </div>
                                <div
                                  id={obj._id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    paddingLeft: 5,
                                  }}
                                >
                                  <p
                                    id={obj._id}
                                    style={{
                                      margin: 0,
                                      paddingRight: 10,
                                      fontSize: 13,
                                    }}
                                  >
                                    {obj.status}
                                  </p>
                                  <p
                                    id={obj._id}
                                    style={{
                                      margin: 0,
                                      paddingLeft: 10,
                                      fontSize: 13,
                                    }}
                                  >
                                    Date:
                                    {moment(obj.dueDate).format("MM/DD/YY")}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  else
                    return (
                      <div style={{ marginTop: 10 }}>
                        <div
                          id={obj._id}
                          onClick={(event) => handleOnClick(event)}
                          style={{
                            margin: 10,
                            border: "1px solid #e0e0e0",
                            borderRadius: 5,
                          }}
                        >
                          <Card
                            id={obj._id}
                            style={{ background: "#7986cb", color: "#fff" }}
                          >
                            <CardContent id={obj._id}>
                              <div id={obj._id}>
                                <div style={{ display: "flex" }}>
                                  <Checkbox
                                    checked={
                                      obj.status == "Completed" ? true : false
                                    }
                                    onClick={(e) => handleCheckBox(e, obj)}
                                    defaultChecked
                                    color="primary"
                                    inputProps={{
                                      "aria-label": "secondary checkbox",
                                    }}
                                    style={{ padding: 0, color: "#fff" }}
                                  />
                                  <h4
                                    style={{ margin: 0, paddingLeft: 12 }}
                                    id={obj._id}
                                  >
                                    {obj.description}
                                  </h4>
                                </div>
                                <div
                                  id={obj._id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    paddingLeft: 5,
                                  }}
                                >
                                  <p
                                    id={obj._id}
                                    style={{
                                      margin: 0,
                                      paddingRight: 10,
                                      fontSize: 13,
                                    }}
                                  >
                                    {obj.status}
                                  </p>
                                  <p
                                    id={obj._id}
                                    style={{
                                      margin: 0,
                                      paddingLeft: 10,
                                      fontSize: 13,
                                    }}
                                  >
                                    Date:
                                    {moment(obj.dueDate).format("MM/DD/YY")}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                else if (new Date(obj.dueDate).getTime() < new Date().getTime())
                  return (
                    <div>
                      <div
                        id={obj._id}
                        style={{
                          margin: 10,
                          border: "1px solid red",
                          borderRadius: 5,
                        }}
                        onClick={(event) => handleOnClick(event)}
                      >
                        <Card id={obj._id}>
                          <CardContent id={obj._id} style={{ display: "flex" }}>
                            <div id={obj._id}>
                              <div style={{ display: "flex" }}>
                                <Checkbox
                                  checked={
                                    obj.status == "Completed" ? true : false
                                  }
                                  onClick={(e) => handleCheckBox(e, obj)}
                                  defaultChecked
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                  style={{ padding: 0 }}
                                />
                                <h4
                                  style={{ margin: 0, paddingLeft: 10 }}
                                  id={obj._id}
                                >
                                  {obj.description}
                                </h4>
                              </div>
                              <div
                                id={obj._id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  marginLeft: 30,
                                }}
                              >
                                <p
                                  id={obj._id}
                                  style={{
                                    margin: 0,
                                    paddingRight: 10,
                                    fontSize: 13,
                                  }}
                                >
                                  {obj.status}
                                </p>
                                <p
                                  id={obj._id}
                                  style={{
                                    margin: 0,
                                    paddingLeft: 10,
                                    fontSize: 13,
                                  }}
                                >
                                  Date:{moment(obj.dueDate).format("MM/DD/YY")}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                else
                  return (
                    <div style={{ marginTop: 10 }}>
                      <div
                        id={obj._id}
                        onClick={(event) => handleOnClick(event)}
                        style={{
                          margin: 10,
                          border: "1px solid #e0e0e0",
                          borderRadius: 5,
                        }}
                      >
                        <Card id={obj._id}>
                          <CardContent id={obj._id} style={{ display: "flex" }}>
                            <div id={obj._id}>
                              <div style={{ display: "flex" }}>
                                <Checkbox
                                  checked={
                                    obj.status == "Completed" ? true : false
                                  }
                                  onClick={(e) => handleCheckBox(e, obj)}
                                  defaultChecked
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                  style={{ padding: 0 }}
                                />
                                <h4
                                  style={{ margin: 0, paddingLeft: 10 }}
                                  id={obj._id}
                                >
                                  {obj.description}
                                </h4>
                              </div>
                              <div
                                id={obj._id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  marginLeft: 30,
                                }}
                              >
                                <p
                                  id={obj._id}
                                  style={{
                                    margin: 0,
                                    paddingRight: 10,
                                    fontSize: 13,
                                  }}
                                >
                                  {obj.status}
                                </p>
                                <p
                                  id={obj._id}
                                  style={{
                                    margin: 0,
                                    paddingLeft: 10,
                                    fontSize: 13,
                                  }}
                                >
                                  Date:{moment(obj.dueDate).format("MM/DD/YY")}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingsObjectivesSideBar;
