import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { PACKAGE_IMAGES } from "../data/packageImages";

/* ---------- Image Component (no flicker) ---------- */
function PackageImage({ imageKey, title }) {
  const src =
    PACKAGE_IMAGES?.[imageKey?.toLowerCase()] || PACKAGE_IMAGES.default;

  return (
    <img
      src={`${src}?q=80&w=600&auto=format&fit=crop`}
      alt={title}
      loading="lazy"
      className="w-32 h-24 rounded-xl object-cover bg-black shrink-0"
      onError={(e) => {
        e.currentTarget.src = PACKAGE_IMAGES.default;
      }}
    />
  );
}

/* ---------- Results Modal ---------- */
export default function ResultsModal({
  open,
  onClose,
  matches = [],
  query = {},
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-[#0A0E12] text-white ring-1 ring-white/10 shadow-2xl max-h-[85vh] overflow-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-white/10">
          <div>
            <h3 className="text-xl font-semibold">Search results</h3>
            <p className="text-sm text-white/70 mt-1">
              Showing{" "}
              <span className="text-sand font-semibold">
                {matches.length}
              </span>{" "}
              packages
              {query.location && <> for “{query.location}”</>}
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/services/tourist"
              className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-sm"
            >
              View all
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {matches.length === 0 ? (
            <div className="text-center py-14 text-white/60">
              No packages found. Try another destination.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {matches.map((p) => (
                <article
                  key={p.id}
                  className="flex gap-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4 hover:ring-sand transition"
                >
                  {/* Image */}
                  <PackageImage
                    imageKey={p.imageKey || p.country || p.city}
                    title={p.title}
                  />

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold leading-tight">
                            {p.title}
                          </h4>
                          <p className="text-sm text-white/70">
                            {p.city}
                            {p.country ? `, ${p.country}` : ""}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-sand font-semibold">
                            {p.price_usd
                              ? `$${p.price_usd}`
                              : p.price || ""}
                          </div>
                          <div className="text-xs text-white/60">from</div>
                        </div>
                      </div>

                      {p.blurb && (
                        <p className="text-sm text-white/70 mt-2 line-clamp-2">
                          {p.blurb}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`https://wa.me/233555000000?text=Hi%20Posgen%2C%20I'm%20interested%20in%20${encodeURIComponent(
                          p.title
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#25D366] text-black text-sm font-semibold"
                      >
                        <FaWhatsapp />
                        WhatsApp
                      </a>

                      <a
                        href={`/services/travel-packages/${p.id}`}
                        className="inline-flex items-center px-3 py-2 rounded-md bg-sand text-black text-sm font-semibold"
                      >
                        View details
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

/* =========================
   PACKAGE IMAGE LIBRARY
   ========================= */
const IMAGE_LIBRARY = {
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  london:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  turkey:
    "https://images.unsplash.com/photo-1549640376-7b1f1b3c6b1a?auto=format&fit=crop&w=900&q=80",
  canada:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  usa:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  ghana:
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
  nigeria:
    "https://images.unsplash.com/photo-1585241936939-be4099591252?auto=format&fit=crop&w=900&q=80",
  default:
    "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=900&q=80",
};

/* =========================
   IMAGE RESOLVER
   ========================= */
function resolveImage(pkg) {
  if (!pkg) return IMAGE_LIBRARY.default;

  const city = (pkg.city || "").toLowerCase().trim();
  const country = (pkg.country || "").toLowerCase().trim();

  // ✅ 1. match by city
  if (city && IMAGE_LIBRARY[city]) {
    return IMAGE_LIBRARY[city];
  }

  // ✅ 2. match by country
  if (country && IMAGE_LIBRARY[country]) {
    return IMAGE_LIBRARY[country];
  }

  // ✅ 3. fallback
  return IMAGE_LIBRARY.default;
}


//   return IMAGE_LIBRARY[key] || IMAGE_LIBRARY.default;
// }

/* =========================
   RESULTS MODAL
   ========================= */
export default function ResultsModal({
  open,
  onClose,
  matches = [],
  query = {},
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0A0E12] text-white p-6 ring-1 ring-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Search Results</h2>
            <p className="text-sm text-white/70 mt-1">
              {matches.length} packages for{" "}
              <span className="text-sand font-semibold">
                {query.location || "your search"}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
          >
            Close
          </button>
        </div>

        {/* Empty State */}
        {matches.length === 0 ? (
          <div className="text-center py-16 text-white/60">
            No packages found. Try another destination.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {matches.map((pkg) => (
              <div
                key={pkg.id}
                className="flex gap-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4 hover:ring-sand transition"
              >
                {/* Image */}
                <img
  src={resolveImage(pkg)}
  alt={pkg.title}
  loading="eager"
  className="w-36 h-24 object-cover object-center rounded-xl bg-black shrink-0"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = IMAGE_LIBRARY.default;
  }}
/>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{pkg.title}</h4>
                      <p className="text-sm text-white/70">
                        {pkg.city}
                        {pkg.country && `, ${pkg.country}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sand font-semibold">
                        {pkg.price_usd ? `$${pkg.price_usd}` : pkg.price || ""}
                      </div>
                      <div className="text-xs text-white/60">from</div>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 mt-2 line-clamp-2">
                    {pkg.blurb}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <a
                      href={`https://wa.me/233555000000?text=${encodeURIComponent(
                        `Hello Posgen, I'm interested in ${pkg.title}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#25D366] text-black font-semibold hover:opacity-90"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>

                    <a
                      href="/services/travel-packages"
                      className="px-3 py-2 rounded-md bg-sand text-black font-semibold hover:opacity-90"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
console.log("Image:", resolveImage(pkg), pkg.city, pkg.country);
 