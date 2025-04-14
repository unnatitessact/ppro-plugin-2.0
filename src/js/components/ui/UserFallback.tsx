import React from "react";

import { cn } from "@nextui-org/react";
import { UserIcon } from "lucide-react";

import { PROFILE_COMBINATIONS } from "../../constants/data-colors/data-colors";

export interface UserFallbackProps {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  color?: string;
  className?: string;
}

const UserFallback = ({
  firstName,
  lastName,
  displayName,
  email,
  color = "amber",
  className,
}: UserFallbackProps) => {
  return (
    <div className="flex h-full w-full flex-shrink-0 items-center justify-center rounded-full">
      <span
        className={cn(
          `flex h-full w-full items-center justify-center whitespace-nowrap rounded-full text-base font-medium tracking-wide`,
          `${PROFILE_COMBINATIONS[color || 0]}`,
          className
        )}
      >
        {/* Checks for firstName first, then checks if last name is also there, in case first name not there checks displayName and then email */}
        {firstName ? (
          firstName.charAt(0).toUpperCase() +
          "" +
          (lastName ? lastName?.charAt(0).toUpperCase() : "")
        ) : displayName ? (
          displayName.charAt(0).toUpperCase()
        ) : email ? (
          email.charAt(0).toUpperCase()
        ) : (
          <UserIcon className="size-5" />
        )}
      </span>
    </div>
  );
};

export default UserFallback;
