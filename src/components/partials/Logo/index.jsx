import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Logo = ({ className, asChild, href = "/", ...props }) => {
  const Comp = asChild ? "span" : Link;
  return (
    <Comp
      className={cn(
        "font-comfortaa flex items-center gap-1 uppercase tracking-widest",
        className,
      )}
      to={href}
      {...props}
    >
      <img
        src="/logo.png"
        width={32}
        height={32}
        alt="logo"
      />
      <span className="text-base text-title">Commerce</span>
    </Comp>
  );
};

export default Logo;
