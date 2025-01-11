import Logo from "@/components/partials/Logo";
import { Button } from "@/components/ui/Button";
import {
  Toggle,
  ToggleOffComp,
  ToggleOnComp,
  ToggleTrigger,
} from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";

const Navigation = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className={cn("sticky top-0 z-50 h-header w-full bg-card", className)}>
      <div className="size-full">
        <div className="container h-full">
          <div className="relative flex h-full items-center justify-between gap-[1em] lg:gap-[1.5em]">
            <Link to={"/"} className="flex h-full items-center text-base">
              <Logo />
            </Link>
            <div className="mr-auto">
              <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            <div className="flex items-center justify-end">
              <div className="hidden md:block">
                <Button
                  as={Link}
                  to="/contact-us"
                  className="font-light tracking-widest"
                >
                  Contact Us
                </Button>
              </div>
              <div className="flex text-title md:hidden">
                <Toggle isOn={isOpen} setIsOn={setIsOpen}>
                  <ToggleTrigger>
                    <ToggleOnComp>
                      <X className="size-[1.25em]" />
                    </ToggleOnComp>
                    <ToggleOffComp>
                      <Menu className="size-[1.25em]" />
                    </ToggleOffComp>
                  </ToggleTrigger>
                </Toggle>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
