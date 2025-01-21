import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";

const DistributionViewPage = () => {
  const location = useLocation();
  const { source } = location.state || {};

  return (
    <main>
      <section className="py-4">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-4xl">
              {source ? (
                <Document
                  file={source}
                  onLoadSuccess={() =>
                    console.log(`PDF rendered from ${source}`)
                  }
                  onLoadError={(error) =>
                    alert(`Cannot render PDF! ${error.message}`)
                  }
                >
                  <Page pageNumber={1} />
                </Document>
              ) : (
                <div className="text-primary">No PDF source provided.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DistributionViewPage;
