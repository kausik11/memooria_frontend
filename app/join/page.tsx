import Onboarding from "@/components/Onboarding";
export const metadata = { title: "Become a creator" };
export default function Join() {
  return <div className="wrap section grid items-start gap-12 md:grid-cols-2"><div><p className="eyebrow">DO WHAT YOU LOVE. MEET YOUR PEOPLE.</p><h2 className="display text-5xl">Make your talent<br /><em className="text-brand">someone’s memory.</em></h2><p className="muted max-w-md leading-7">Tell us about your services, one question at a time. Build your portfolio, share your rates and let our team review your creator application.</p><ul className="mt-8 space-y-4 text-sm"><li>A dedicated home for your portfolio</li><li>Questions tailored to your service</li><li>Private identity verification</li></ul></div><div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"><Onboarding kind="creator" /></div></div>;
}
