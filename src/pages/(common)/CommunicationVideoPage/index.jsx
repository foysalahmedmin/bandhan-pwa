import ViewItem from "@/components/partials/ViewItem";
import { useLocation } from "react-router-dom";

const CommunicationVideoPage = () => {
  const routeLocation = useLocation();

  return (
    <div>
      <section>
        <div className="container">
          <ViewItem state={routeLocation?.state || {}} />
        </div>
      </section>
    </div>
  );
};

export default CommunicationVideoPage;
