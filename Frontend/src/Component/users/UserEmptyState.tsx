import React from "react";
import {
  Button,
} from "@fluentui/react-components";
import {
  People24Regular,
} from "@fluentui/react-icons";

interface UserEmptyStateProps {
  hasFilters: boolean;
  onClear: () => void;
}

const UserEmptyState: React.FC<UserEmptyStateProps> = ({
  hasFilters,
  onClear,
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <People24Regular className="text-gray-400 text-5xl mb-3" />

      <h3 className="text-lg font-semibold text-gray-700">
        No users found
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {hasFilters
          ? "Try changing your search or filters."
          : "There are no users available."}
      </p>

      {hasFilters && (
        <Button
          className="mt-4"
          appearance="secondary"
          onClick={onClear}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default UserEmptyState;