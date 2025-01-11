import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../Logo";

const Address = () => {
  return (
    <div className="space-y-6">
      <Logo className="text-xl text-light" />
      <div>
        <p className="text-lg">Aegon House</p>
        <p className="text-lg">13 Lanark Square (Ground Floor East)</p>
        <p className="text-lg">London E14 3LP</p>
        <p className="text-lg">02081495432</p>
      </div>
      <ul className="flex items-center gap-4">
        <li>
          <Link>
            <Instagram />
          </Link>
        </li>
        <li>
          <Link>
            <Linkedin />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Address;
