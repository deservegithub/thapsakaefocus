import Image from "next/image"

// แกลเลอรีรูป (server component) — กริดรูปสำหรับหน้า detail
export function Gallery({ images, title }: { images: { url: string }[]; title: string }) {
  if (!images.length) return null
  return (
    <section className="mt-6">
      <h2 className="mb-2 font-semibold text-neutral-800">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((im, i) => (
          <div key={i} className="relative h-32 w-full sm:h-36">
            <Image
              src={im.url}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
