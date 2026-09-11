import InquiryForm from "@/components/InquiryForm";
export const metadata = { title: "Become a creator" };
export default function Join() {
  return (
    <div className="wrap section grid gap-12 md:grid-cols-2">
      <div>
        <p className="eyebrow">DO WHAT YOU LOVE. MEET YOUR PEOPLE.</p>
        <h1 className="display text-5xl">
          Make your talent
          <br />
          <em className="text-brand">someone’s memory.</em>
        </h1>
        <p className="muted max-w-md leading-7">
          Join our community of photographers, artists, and creative businesses.
          Tell us about your work and our team will help you create your own
          business page.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li>✦ A dedicated home for your portfolio</li>
          <li>✦ Your services, packages, and availability</li>
          <li>✦ Inquiries from people looking for your talent</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-8">
        <h2 className="display text-3xl">Introduce yourself.</h2>
        <InquiryForm service="Creator application" />
      </div>
    </div>
  );
}
