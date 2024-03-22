import React, { FC, useRef, useState } from "react";

import { accessControlRols, IAcccessControlRoles } from "@app/contracts/";

export interface IAccessRoleSelector {
  onSelected(index: number): void;
}

const AccessRoleSelector: FC<IAccessRoleSelector> = ({
  onSelected
}) => {

  const [selectedRole, setSelectedRole] = useState<IAcccessControlRoles>(
    accessControlRols[0]
  );

  const onRoleSeleected = (index: number): void => {
    // index = (index - 1);
    if (index >= 0) {
      const item = accessControlRols[index];
      setSelectedRole(item);
      onSelected(index);
    }
  }

  return (
    <div className="input-main-wrapper" style={{ marginBottom: '1px', paddingBottom: '1px' }}>
      <select
        className="input-main"
        defaultValue={0}
        onChange={(event) => {
          onRoleSeleected(+event?.target?.selectedIndex);
        }}
      >
        {/* <option value="">Select role</option> */}
        {accessControlRols.map((AC: IAcccessControlRoles, index: number) => {
          return (
            <option
              key={`access-role-index-${index}`}
              value={index}
            >
              {AC.name}
            </option>
          )
        })}
      </select>

    </div>

  )
}

export default AccessRoleSelector;


