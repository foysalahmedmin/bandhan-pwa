import { Button } from "@/components/ui/Button";
import { AlertOctagon } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const { error, status } = useRouteError();
  return (
    <section className="flex h-screen items-center bg-gray-100 p-16 text-gray-900">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <AlertOctagon className="size-40 text-yellow-500" />
        <div className="max-w-md space-y-6 text-center">
          <h2 className="text-animation text-9xl font-extrabold">
            <span className="sr-only">Error</span>
            {status || 404}
          </h2>
          <p className="text-2xl font-semibold text-red-800 md:text-5xl">
            {error?.message}
          </p>
          <Link to="/" className="btn-primary">
            <Button asChild={true}> Back to Home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
