"use client";
import Image from "next/image";
import { useRef, useState } from "react";
export default function Gallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selected, setSelected] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="columns-2 gap-3">
        {images
          .filter((src) => typeof src === "string" && src.trim())
          .map((src, i) => (
            <button
              className="relative mb-3 block w-full overflow-hidden rounded-xl"
              style={{ height: i % 3 === 0 ? 280 : 200 }}
              key={`${src}-${i}`}
              aria-label={`Enlarge ${name} photo ${i + 1}`}
              onClick={() => {
                setSelected(src);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={src}
                alt={`${name} portfolio ${i + 1}`}
                fill
                sizes="(max-width:767px) 50vw,33vw"
                className="object-cover"
              />
            </button>
          ))}
      </div>
      <dialog
        ref={dialog}
        className="m-auto w-[90vw] max-w-5xl rounded-xl bg-ink p-4 text-white backdrop:bg-black/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="relative z-10 mb-3 ml-auto block rounded-md px-3 py-2"
          onClick={() => dialog.current?.close()}
          aria-label="Close photo"
        >
          Close ×
        </button>
        {selected && (
          <div className="relative h-[75vh] w-full">
            <Image
              src={selected}
              alt={`${name} enlarged portfolio`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        )}
      </dialog>
    </>
  );
}
