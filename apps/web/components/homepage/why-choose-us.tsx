import Image from 'next/image'

const WhyChooseUs = () => {
  return (
    <section className="container mx-auto bg-white px-4 py-16">
      <div className="mx-20 grid grid-cols-2 gap-0">
        {/* Top Left — Image */}
        <div className="relative h-[520px] overflow-hidden">
          <Image
            src="/images/why-choose-us/necklace.webp"
            alt="Gold necklace"
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Top Right — Crafted With Purpose */}
        <div className="relative flex flex-col items-center justify-center px-16 py-12">
          {/* Top icons */}
          <div className="absolute top-12 left-12">
            <Image
              src="/images/icons/sparkle.svg"
              alt="sparkle"
              width={32}
              height={32}
            />
          </div>
          <div className="absolute top-12 right-12">
            <Image
              src="/images/icons/diamond.svg"
              alt="diamond"
              width={32}
              height={32}
            />
          </div>

          {/* Title */}
          <div className="relative">
            <Image
              src="/images/icons/crown.svg"
              alt="crown"
              width={28}
              height={28}
              className="absolute bottom-12 -left-6"
            />
            <h2 className="mb-6 font-le-jour text-3xl font-bold tracking-widest text-purple-700 uppercase">
              Crafted With Purpose
            </h2>
          </div>

          {/* Body */}
          <p className="w-xs text-center font-sans text-lg leading-relaxed text-gray-700">
            Every piece is thoughtfully designed and expertly crafted to reflect
            elegance, quality, and lasting beauty.
          </p>

          {/* Bottom sparkle */}
          <div className="absolute right-24 bottom-18">
            <Image
              src="/images/icons/sparkle.svg"
              alt="sparkle"
              width={32}
              height={32}
            />
          </div>
        </div>

        {/* Bottom Left — The Art of Fine Jewelry */}
        <div className="relative flex flex-col items-center justify-center px-16 py-12">
          {/* Star icon */}
          <div className="absolute top-16 left-32 mb-6">
            <Image
              src="/images/icons/star.svg"
              alt="star"
              width={32}
              height={32}
            />
          </div>

          {/* Title */}
          <div className="relative">
            <Image
              src="/images/icons/crown.svg"
              alt="crown"
              width={28}
              height={28}
              className="absolute bottom-12 -left-6"
            />
            <h2 className="mb-6 font-le-jour text-3xl font-bold tracking-widest text-purple-700 uppercase">
              The Art of Fine Jewelry
            </h2>
          </div>

          {/* Body */}
          <p className="w-xs text-center font-sans text-lg leading-relaxed text-gray-700">
            We combine premium materials, expert craftsmanship, and timeless
            design to create pieces you&apos;ll treasure forever.
          </p>

          {/* Bottom icons */}
          <div className="absolute right-20 bottom-28">
            <Image
              src="/images/icons/ring.svg"
              alt="ring"
              width={32}
              height={32}
            />
          </div>
          <div className="absolute bottom-16 left-12">
            <Image
              src="/images/icons/bag.svg"
              alt="bag"
              width={32}
              height={32}
            />
          </div>
        </div>

        {/* Bottom Right — Image */}
        <div className="relative h-[480px] overflow-hidden">
          <Image
            src="/images/why-choose-us/earring.webp"
            alt="Gold V earring"
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
