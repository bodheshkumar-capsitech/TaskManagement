import React from "react";
import {
  Badge,
} from "@fluentui/react-components";
import {
  People24Regular,
} from "@fluentui/react-icons";

interface UsersHeaderProps {
  totalUsers: number;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({
  totalUsers,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <People24Regular className="text-gray-700" />

          <h1 className="text-2xl font-semibold text-gray-900">
            Users
          </h1>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Manage all users and their access
        </p>
      </div>

      <Badge appearance="tint">
        {totalUsers} Users
      </Badge>
    </div>
  );
};

export default UsersHeader;