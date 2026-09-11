export default function Loading() {
  return (
    <div className="wrap section animate-pulse" aria-label="Loading page">
      <div className="mb-8 h-80 rounded-2xl bg-stone-200" />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="h-60 rounded-xl bg-stone-200" key={i} />
        ))}
      </div>
    </div>
  );
}
