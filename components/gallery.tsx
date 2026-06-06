// แกลเลอรีรูป (server component) — กริดรูปสำหรับหน้า detail
export function Gallery({ images, title }: { images: { url: string }[]; title: string }) {
  if (!images.length) return null
  return (
    <section className="mt-6">
      <h2 className="mb-2 font-semibold text-neutral-800">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((im, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={im.url}
            alt=""
            className="h-32 w-full rounded-lg object-cover sm:h-36"
          />
        ))}
      </div>
    </section>
  )
}
