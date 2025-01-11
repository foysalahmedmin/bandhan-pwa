import { Link } from "react-router-dom";

const Legal = () => {
  const partnerships = [
    {
      label: "Terms and Conditions",
      url: "/terms",
    },
    {
      label: "Privacy Policy",
      url: "/privacy-policy",
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg">Legal</p>
      <ul className="">
        {partnerships?.map((item, index) => (
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

export default Legal;
