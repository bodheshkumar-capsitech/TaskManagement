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
    <div className="flex items-center justify-end gap-4">
      <Badge appearance="tint">
        {totalUsers} Users
      </Badge>
    </div>
  );
};

export default UsersHeader;