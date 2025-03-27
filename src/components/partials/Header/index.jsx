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

const labels = {
  "/": {
    en: "",
    bn: "",
  },
  "/settings": {
    en: "settings",
    bn: "সেটিংস",
  },
  "/notifications": {
    en: "notifications",
    bn: "নোটিফিকেশনস",
  },
  "/call-status": {
    en: "call status",
    bn: "কল স্ট্যাটাস",
  },
  "/call-update": {
    en: "call update",
    bn: "কল আপডেট",
  },
  "/communication-video": {
    en: "communication video",
    bn: "কমিউনিকেশন ভিডিও",
  },
  "/communication-pannel": {
    en: "communication pannel",
    bn: "কমিউনিকেশন প্যানেল",
  },
  "/select-reward": {
    en: "select reward",
    bn: "রিওয়ার্ড নির্বাচন",
  },
  "/outlet-location-instruction": {
    en: "outlet location instruction",
    bn: "আউটলেটের অবস্থানের নির্দেশনা",
  },
  "/eas-advocacy": {
    en: "eas advocacy",
    bn: "ইএএস এডভোকেসি",
  },
  "/communication": {
    en: "communication",
    bn: "কমিউনিকেশন",
  },
  "/guideline": {
    en: "guideline",
    bn: "গাইডলাইন",
  },
  "/distribution-status": {
    en: "distribution status",
    bn: "ডিস্ট্রিবিউশন স্ট্যাটাস",
  },
  "/distribution-incentive": {
    en: "distribution incentive",
    bn: "ইন্সেন্টিভ ডিস্ট্রিবিউশন",
  },
  "/outlet-survey": {
    en: "outlet survey",
    bn: "আউটলেট সার্ভে",
  },
  "outlet-survey-questions": {
    en: "outlet survey questions",
    bn: "আউটলেট সার্ভে প্রশ্নসমূহ",
  },
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

  const label = isEnglish
    ? labels?.[location?.pathname]?.en || ""
    : labels?.[location?.pathname]?.bn || "";

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
