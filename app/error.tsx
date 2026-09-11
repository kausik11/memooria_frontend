"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="wrap section text-center">
      <h1 className="display section-title">We couldn’t load this page.</h1>
      <p className="muted">
        Please try again in a moment. If you’re setting up Memooria, make sure
        the API and database are running.
      </p>
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
