import React from "react";
import {
  Avatar,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import type { Users } from "../../types/Users/Users";

interface UserTableProps {
  users:Users[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="h-full w-full overflow-x-auto overflow-y-auto hide-scrollbar">
      <Table
        aria-label="Users table"
        size="medium"
        className="w-full min-w-[600px]"
      >
        <TableHeader>
          <TableRow>
            <TableHeaderCell>User</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={`${user.email}-${index}`}>
              <TableCell className="!py-2">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={user.username}
                    size={40}
                  />

                  <span className="font-medium text-gray-900 truncate">
                    {user.username}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
              </TableCell>

              <TableCell>
                <Badge appearance="tint">
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge
                  appearance="tint"
                  color={
                    user.status.toLowerCase() === "active"
                      ? "success"
                      : "danger"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;