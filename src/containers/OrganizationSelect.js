import React, { useState } from "react";
import DropDown from "../components/controls/DropDown";
import MenuItem from "../components/controls/MenuItem";
import axios from "axios";
import { useOrganizations } from "../context/OrganizationProvider";
//         <MenuItem key={x.organizationID} value={x.organizationID}>
//           {" "}
//           {x.organizationName}{" "}
//         </MenuItem>
const OrganizationSelect = ({ value, onChange, ...props }, ref) => {
  const [name, setName] = useState(null);
  const [organizations] = useOrganizations();
  return (
    <DropDown
      // label="Organization"
      value={value}
      onChange={onChange}
      name={props.name}
      id={props.id}
      {...props}
    >
      {organizations.data &&
        organizations.data.map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))}
    </DropDown>
  );
};

export default OrganizationSelect;
