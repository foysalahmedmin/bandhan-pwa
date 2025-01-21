import { Bell } from "@/assets/svg/Bell";
import { Button } from "@/components/ui/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownToggler,
} from "@/components/ui/Dropdown";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import { ArrowLeft, EllipsisVertical, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const labelsEn = {
  "/": "",
  "/settings": "settings",
  "/notifications": "notifications",
  "/call-status": "call status",
  "/call-update": "call update",
  "/communication-video": "communication video",
  "/communication-pannel": "communication pannel",
  "/select-reward": "select reward",
  "/outlet-location-instruction": "outlet location instruction",
  "/eas-advocacy": "eas advocacy",
  "/communication": "communication",
  "/guideline": "guideline",
};

const labelsBn = {
  "/": "",
  "/settings": "সেটিংস",
  "/notifications": "নোটিফিকেশনস",
  "/call-status": "কল স্ট্যাটাস",
  "/call-update": "কল আপডেট",
  "/communication-video": "কমিউনিকেশন ভিডিও",
  "/communication-pannel": "কমিউনিকেশন প্যানেল",
  "/select-reward": "রিওয়ার্ড নির্বাচন",
  "/outlet-location-instruction": "আউটলেটের অবস্থানের নির্দেশনা",
  "/eas-advocacy": "ইএএস এডভোকেসি",
  "/communication": "কমিউনিকেশন",
  "/guideline": "গাইডলাইন",
};

const Header = ({ className }) => {
  const { setUser, setUserInfo, setLoginPanel } = useAuthenticationState();
  const { isEnglish } = useLanguageState();

  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };
  const handleLogout = () => {
    setUser(null);
    setUserInfo({});
    setLoginPanel("");
    navigate("/authentication/sign-in");
  };

  const labels = isEnglish ? labelsEn : labelsBn;
  const label = labels[location?.pathname] || "";

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 h-header w-full bg-[#f5dbd5]",
          className,
        )}
      >
        <div className="size-full">
          <div className="container h-full">
            <div className="relative flex h-full items-center justify-between gap-[1em] lg:gap-[1.5em]">
              <div className="flex items-center justify-start">
                {location?.pathname !== "/" && (
                  <Button
                    onClick={handleBack}
                    className="font-light text-accent"
                    shape="none"
                    variant="none"
                    size="none"
                  >
                    <ArrowLeft className="size-6" />
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-center">
                <strong className="capitalize leading-none text-primary">
                  {label}
                </strong>
              </div>
              <div className="flex items-center justify-end gap-2">
                <div>
                  <Link
                    className="font-light text-accent"
                    to={"/notifications"}
                  >
                    <Bell className="size-6" />
                  </Link>
                </div>
                <div>
                  <Dropdown>
                    <DropdownToggler
                      className="font-light text-accent"
                      shape="none"
                      variant="none"
                      size="none"
                    >
                      <EllipsisVertical className="size-6" />
                    </DropdownToggler>
                    <DropdownContent className="left-auto right-0 w-40 self-center bg-primary text-primary-foreground">
                      <div>
                        <ul className="space-y-4">
                          <li>
                            <Link
                              className="flex items-center gap-2 font-light"
                              to={"/settings"}
                            >
                              <Settings />{" "}
                              <span>{isEnglish ? "Setting" : "সেটিং"}</span>
                            </Link>
                          </li>
                          <hr className="border-primary-foreground" />
                          <li>
                            <Button
                              onClick={() => handleLogout()}
                              shape="none"
                              variant="none"
                              size="none"
                            >
                              <LogOut />{" "}
                              <span>{isEnglish ? "Logout" : "লগ আউট"}</span>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
