import { cn } from "@/lib/utils";

const Span = ({ children, className }) => (
  <span
    className={cn(
      "m-2 block animate-loading-spin rounded-full border-2 border-background border-l-border border-r-border border-t-primary",
      className,
    )}
  >
    {children}
  </span>
);

const NestedSpan = ({ depth, className }) => {
  if (depth === 0) {
    return (
      <Span
        className={cn(
          "border-primary border-b-primary border-l-primary border-t-primary",
          className,
        )}
      />
    );
  }

  return (
    <Span className={className}>
      <NestedSpan className={className} depth={depth - 1} />
    </Span>
  );
};

const Loading = ({ className, depth = 3 }) => {
  return (
    <main className="inline-flex items-center justify-center">
      <div>
        <NestedSpan className={className} depth={depth} />
      </div>
    </main>
  );
};

export default Loading;
