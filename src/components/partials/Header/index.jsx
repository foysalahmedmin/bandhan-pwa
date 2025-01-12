import { Bell } from "@/assets/svg/Bell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const labels = {
  "/": "",
  "/notifications": "notifications",
  "/call-status": "call status",
  "/communication-pannel": "communication pannel",
  "/select-reward": "select reward",
  "/outlet-location-instruction": "outlet location instruction",
  "/eas-advocacy": "eas advocacy",
};

const Header = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const label = labels[location?.pathname] || "";

  return (
    <>
      <nav className={cn("sticky top-0 z-50 h-header w-full", className)}>
        <div className="size-full">
          <div className="container h-full">
            <div className="relative flex h-full items-center justify-between gap-[1em] lg:gap-[1.5em]">
              <div className="flex items-center justify-start">
                {location?.pathname !== "/" && (
                  <Button
                    onClick={handleBack}
                    className="font-light tracking-widest text-accent"
                    shape="none"
                    variant="none"
                    size="none"
                  >
                    <ArrowLeft className="size-6" />
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-center">
                <strong className="capitalize leading-none">{label}</strong>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Link
                  className="font-light tracking-widest text-accent"
                  to={"/notifications"}
                >
                  <Bell className="size-6" />
                </Link>
                <Button
                  className="font-light tracking-widest text-accent"
                  shape="none"
                  variant="none"
                  size="none"
                >
                  <EllipsisVertical className="size-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
