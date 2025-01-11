import Logo from "@/components/partials/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import NavItems from "./NavItems";

const routes = [
  {
    label: "Discover",
    children: [
      {
        label: "Services",
        path: "/services",
        text: "Tailored Health for Meaningful Change",
      },
      {
        label: "Treatments",
        path: "/treatments",
        text: "Whenever and Wherever You Are",
      },
      {
        label: "Locations",
        path: "/locations",
        text: "Whenever and Wherever You Are",
      },
      {
        label: "Experiences",
        path: "/experiences",
        text: "Transcend the Ordinary to Reignite Your Health",
      },
      {
        label: "Team",
        path: "/team",
        text: "Clinician Founded with Recognised Experts",
      },
    ],
  },
  {
    label: "Membership ",
    children: [
      {
        label: "Individual & Family GP",
        path: "/individual-family-gp",
        text: "Assuring your health",
      },
      {
        label: "Longevity",
        path: "/longevity",
        text: "A life lived well",
      },
      {
        label: "Seasonal",
        path: "/seasonal",
        text: "3-month deep dive",
      },
    ],
  },
  {
    path: "/about",
    label: "About ",
  },
];

const routesMobile = [
  {
    path: "/about",
    label: "About ",
  },
  {
    label: "Services",
    path: "/services",
    text: "Tailored Health for Meaningful Change",
  },
  {
    label: "Treatments",
    path: "/treatments",
    text: "Whenever and Wherever You Are",
  },
  {
    label: "Locations",
    path: "/locations",
    text: "Whenever and Wherever You Are",
  },
  {
    label: "Experiences",
    path: "/experiences",
    text: "Transcend the Ordinary to Reignite Your Health",
  },
  {
    label: "Team",
    path: "/team",
    text: "Clinician Founded with Recognised Experts",
  },
  {
    label: "Individual & Family GP",
    path: "/individual-family-gp",
    text: "Assuring your health",
  },
  {
    label: "Longevity",
    path: "/longevity",
    text: "A life lived well",
  },
  {
    label: "Seasonal",
    path: "/seasonal",
    text: "3-month deep dive",
  },
  {
    path: "/contact-us",
    label: "Contact Us",
  },
];

const NavMenu = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Desktop Screen */}
      <div className="relative hidden px-8 md:block">
        <ul className="flex size-full items-center justify-start gap-[1em]">
          <NavItems routes={routes} />
        </ul>
      </div>
      {/* Mobile Screen */}
      <div
        className={cn(
          "fixed inset-0 z-50 h-screen w-screen origin-left bg-card transition-all duration-300 lg:hidden",
          {
            "visible translate-x-0": isOpen,
            "invisible -translate-x-full": !isOpen,
          },
        )}
      >
        <div className="container space-y-6">
          <div className="flex h-header items-center justify-between">
            <div>
              <Logo />
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              shape="icon"
              className="rounded-full bg-accent/5"
            >
              <X className="size-[1.25em]" />
            </Button>
          </div>
          <ul className="flex size-full flex-col gap-[1em]">
            <NavItems isOpen={isOpen} setIsOpen={setIsOpen} routes={routesMobile} />
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavMenu;
