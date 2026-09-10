import React from "react";
import {
  Button,
  Dropdown,
  Input,
  Option,
} from "@fluentui/react-components";
import {
  Search24Regular,
  Dismiss24Regular,
} from "@fluentui/react-icons";

interface UserFiltersProps {
  search: string;
  selectedRole: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  selectedRole,
  selectedStatus,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClear,
}) => {
  const hasFilters =
    search ||
    selectedRole !== "All" ||
    selectedStatus !== "All";

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex-1">
        <Input
          className="w-full"
          size="large"
          placeholder="Search by username or email..."
          value={search}
          contentBefore={<Search24Regular />}
          contentAfter={
            search ? (
              <Button
                appearance="subtle"
                size="small"
                icon={<Dismiss24Regular />}
                onClick={() => onSearchChange("")}
              />
            ) : undefined
          }
          onChange={(_, data) => {
            onSearchChange(data.value);
          }}
        />
      </div>

      <Dropdown
        value={selectedRole}
        selectedOptions={[selectedRole]}
        onOptionSelect={(_, data) => {
          onRoleChange(data.optionValue ?? "All");
        }}
      >
        <Option value="All">All Roles</Option>
        <Option value="Admin">Admin</Option>
        <Option value="Manager">Manager</Option>
        <Option value="Employee">Employee</Option>
        <Option value="User">User</Option>
      </Dropdown>

      <Dropdown
        value={selectedStatus}
        selectedOptions={[selectedStatus]}
        onOptionSelect={(_, data) => {
          onStatusChange(data.optionValue ?? "All");
        }}
      >
        <Option value="All">All Status</Option>
        <Option value="Active">Active</Option>
        <Option value="Inactive">Inactive</Option>
      </Dropdown>

      {hasFilters && (
        <Button
          appearance="secondary"
          onClick={onClear}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default UserFilters;