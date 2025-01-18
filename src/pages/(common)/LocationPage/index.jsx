import { useLocation } from "@/components/providers/LocationProvider";
import { Button } from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import axios from "axios";
import { useLayoutEffect, useState } from "react";

const LocationPage = () => {
  const { isEnglish } = useLanguageState();
  const { userInfo } = useAuthenticationState();
  const { location } = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  const [outletLocation, setOutletLocation] = useState([]);

  const origin = `${location?.latitude},${location?.longitude}`;
  const dest = `${outletLocation[1]},${outletLocation[0]}`;

  useLayoutEffect(() => {
    if (userInfo.outletCode) {
      setOutlets(userInfo.outletCode);
    }
  }, [userInfo.outletCode]);

  useLayoutEffect(() => {
    if (!selectedOutlet?.value) return;

    const handleSelect = async () => {
      try {
        setIsLoading(true);
        const url = `${URLS.baseURL}/api/outlet/location/${selectedOutlet?.value}`;
        const response = await axios.get(url);
        const coordinates = response?.data?.location?.coordinates || [];
        setOutletLocation(coordinates);
      } catch (error) {
        console.error("Error fetching outlet location:", error);
      } finally {
        setIsLoading(false);
      }
    };
    handleSelect();
  }, [selectedOutlet?.value]);

  const getDirections = () => {
    const apiUrl = `http://maps.google.com/maps?saddr=${origin}&daddr=${dest}`;
    window.open(apiUrl, "_blank");
  };

  return (
    <main>
      <section>
        <div className="container space-y-4">
          <div className="space-y-2">
            <span className="block font-semibold text-primary">
              {isEnglish ? "Select Outlet Code" : "আউটলেট কোড নির্বাচন করুন"}
            </span>
            <div>
              <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm">
                  {isEnglish ? "Outlet" : "আউটলেট"}
                </span>
                <Select
                  className="col-span-3"
                  value={selectedOutlet}
                  options={outlets || []}
                  onChange={(item) => {
                    setSelectedOutlet(item);
                  }}
                />
              </label>
            </div>
          </div>
          {selectedOutlet?.value && origin && dest && (
            <Button
              className="w-full"
              isLoading={isLoading}
              onClick={getDirections}
            >
              {isEnglish ? "View" : "দেখুন"}
            </Button>
          )}
        </div>
      </section>
    </main>
  );
};

export default LocationPage;
