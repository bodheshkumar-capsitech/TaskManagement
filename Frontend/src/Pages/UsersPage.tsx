import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Spinner,
} from "@fluentui/react-components";

import type { Users } from "../types/Users/Users";
import { getAllUsers } from "../api/todoApi";
import UsersHeader from "../Component/users/UsersHeader";
import UserFilters from "../Component/users/UserFilters";
import UserTable from "../Component/users/UserTable";
import UserEmptyState from "../Component/users/UserEmptyState";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

    //   setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchText ||
        user.username
          .toLowerCase()
          .includes(searchText) ||
        user.email
          .toLowerCase()
          .includes(searchText);

      const matchesRole =
        selectedRole === "All" ||
        user.role.toLowerCase() ===
          selectedRole.toLowerCase();

      const matchesStatus =
        selectedStatus === "All" ||
        user.status.toLowerCase() ===
          selectedStatus.toLowerCase();

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    selectedRole,
    selectedStatus,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedRole("All");
    setSelectedStatus("All");
  };

  const hasFilters =
    search ||
    selectedRole !== "All" ||
    selectedStatus !== "All";

  return (
    <div className="h-full min-h-0 flex flex-col p-5 md:p-6 bg-gray-50">

      {/* Header + Filters */}
      <div className="flex flex-col gap-4 mb-5">
        <UsersHeader
          totalUsers={users.length}
        />

        <UserFilters
          search={search}
          selectedRole={selectedRole}
          selectedStatus={selectedStatus}
          onSearchChange={setSearch}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onClear={clearFilters}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden bg-white border border-gray-200 rounded-xl">

        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner
              size="medium"
              label="Loading users..."
            />
          </div>
        ) : filteredUsers.length === 0 ? (
          <UserEmptyState
            hasFilters={Boolean(hasFilters)}
            onClear={clearFilters}
          />
        ) : (
          <UserTable
            users={filteredUsers}
          />
        )}
      </div>

      {/* Footer */}
      {!loading && users.length > 0 && (
        <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
          <span>
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </span>
        </div>
      )}
    </div>
  );
};

export default UsersPage;