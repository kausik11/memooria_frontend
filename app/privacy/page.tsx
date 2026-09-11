export const metadata = { title: "Privacy & terms" };
export default function Privacy() {
  return (
    <article className="wrap section max-w-3xl">
      <h1 className="display section-title">Privacy & marketplace terms</h1>
      <h2 className="mt-8 text-xl">Your information</h2>
      <p className="muted leading-7">
        Memooria stores the contact details, inquiries, account information, and
        reviews you submit. We use these details to manage your account and
        connect you with the creators you ask about. Passwords are hashed.
        Session cookies keep you signed in; saved creators are stored in your
        browser.
      </p>
      <h2 className="mt-8 text-xl">Inquiries and services</h2>
      <p className="muted leading-7">
        An inquiry does not create a confirmed booking. Pricing, deliverables,
        cancellation arrangements, and payment must be agreed directly with your
        creator. Package prices are starting estimates. Memooria does not
        currently collect payments or offer instant bookings.
      </p>
      <h2 className="mt-8 text-xl">Reviews and content</h2>
      <p className="muted leading-7">
        Only share honest experiences and content you have permission to
        publish. Reviews are moderated before publication. Creators are
        responsible for the accuracy of their listings.
      </p>
      <h2 className="mt-8 text-xl">Contact and data requests</h2>
      <p className="muted leading-7">
        Use the contact form on our homepage to request access, corrections, or
        deletion of your information. Do not include payment information or
        other sensitive documents in inquiries.
      </p>
    </article>
  );
}
