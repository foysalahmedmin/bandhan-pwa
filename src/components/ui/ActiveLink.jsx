import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

const ActiveLink = forwardRef(
  (
    { children, className, activeClassName, loadingClassName, ...props },
    ref,
  ) => {
    return (
      <NavLink
        className={({ isActive, isPending }) =>
          cn("", className, {
            [cn("", activeClassName)]: isActive,
            [cn("cursor-wait opacity-50", loadingClassName)]: isPending,
          })
        }
        {...props}
        ref={ref}
      >
        {children}
      </NavLink>
    );
  },
);
ActiveLink.displayName = "ActiveLink";

export { ActiveLink };
