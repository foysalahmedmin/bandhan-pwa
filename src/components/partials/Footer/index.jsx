import Address from "./Address";
import Company from "./Company";
import Discover from "./Discover";
import Legal from "./Legal";
import Membership from "./Membership";

const Footer = () => {
  return (
    <>
      <footer className="space-y-16">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Address />
            </div>
            <div className="grid gap-8 gap-x-12 md:col-span-2 md:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
              <Discover />
              <Membership />
              <Company />
              <Legal />
            </div>
          </div>
        </div>
        <div className="bg-card">
          <div className="container py-4">
            <div>© ARKangel Clinic {new Date().getFullYear()}</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
