import { Button } from "@/components/ui/Button";
import useLanguageState from "@/hooks/state/useLanguageState";
import { File } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DistributionStatusPage = ({ location }) => {
  const { disStatus, pdfLink } = location?.state || {};
  const { isEnglish } = useLanguageState();
  const navigate = useNavigate();

  return (
    <main>
      <section>
        <div className="container">
          {pdfLink !== undefined ? (
            <div className="space-y-2 rounded-md bg-gray-100">
              <h2 className="font-semibold text-primary">
                {isEnglish ? "View Pdf" : "পিডিএফ দেখুন"}
              </h2>
              <Button
                onClick={() =>
                  navigate("/distribution-view", {
                    state: { pdfLink, source: pdfLink },
                  })
                }
                shape="icon"
              >
                <File />
              </Button>
            </div>
          ) : (
            <div className="">
              <p className="font-bold text-primary">
                {isEnglish
                  ? "Sorry no gift was distributed at this outlet."
                  : "দুঃখিত এই আউটলেটে কোনো গিফট ডিস্ট্রিবিউশন হয়নি"}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DistributionStatusPage;
