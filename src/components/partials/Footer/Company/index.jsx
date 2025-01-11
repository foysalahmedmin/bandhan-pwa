import { Link } from "react-router-dom";

const Company = () => {
  const links = [
    {
      label: "About",
      url: "/about",
    },
    {
      label: "Contact",
      url: "/contact-us",
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg">Company</p>
      <ul className="">
        {links?.map((item, index) => (
          <li key={index}>
            <Link
              className="cursor-pointer underline-offset-2 hover:decoration-secondary"
              to={item?.url}
              target={item?.target && item?.target}
              rel={item?.rel && item?.rel}
            >
              {item?.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Company;
