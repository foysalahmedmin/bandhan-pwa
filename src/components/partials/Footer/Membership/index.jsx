import { Link } from "react-router-dom";

const Membership = () => {
  const links = [
    {
      label: "Individual & Family GP",
      url: "https://ARKangel.health/individual-family-gp/",
    },
    { label: "Longevity", url: "https://ARKangel.health/longevity/" },
    { label: "Seasonal", url: "https://ARKangel.health/seasonal" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg uppercase">Membership</p>
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

export default Membership;
