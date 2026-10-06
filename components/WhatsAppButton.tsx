import { FaWhatsapp } from "react-icons/fa";

const PHONE = "919330224549";
const MESSAGE = "Hi Memooria! I'd love some help finding the right creator for my event.";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Memooria on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}
