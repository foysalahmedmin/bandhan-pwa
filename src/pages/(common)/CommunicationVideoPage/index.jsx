import ViewItem from "@/components/partials/ViewItem";
import { useLocation } from "react-router-dom";

const CommunicationVideoPage = () => {
  const routeLocation = useLocation();

  return (
    <div>
      <section>
        <div className="container flex min-h-screen-minus-header items-center py-4">
          <ViewItem state={routeLocation?.state || {}} />
        </div>
      </section>
    </div>
  );
};

export default CommunicationVideoPage;
