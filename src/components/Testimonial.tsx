import Container from './ui/Container'
import { testimonialAvatar, testimonialPortrait } from './ui/images'

export default function Testimonial() {
  return (
    <Container className="py-10">
      <div
        id="testimonial"
        className="relative scroll-mt-24 overflow-hidden rounded-[40px] lg:h-139 lg:rounded-3xl"
      >
        <img
          src={testimonialPortrait}
          alt="Samantha William standing outdoors with arms outstretched"
          className="absolute inset-0 size-full object-cover object-[75%_center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/60 lg:bg-gradient-to-r lg:from-black/75 lg:via-black/40 lg:to-black/5"
        />

        <div className="relative flex max-w-140 flex-col gap-6 p-8 lg:h-139 lg:justify-center lg:p-20">
          <div className="flex flex-col gap-2 text-white">
            <p className="text-[20px] leading-7 tracking-[-1px] opacity-50 lg:text-[30px] lg:leading-9.5">
              What people said
            </p>
            <p className="text-[36px] leading-10.5 tracking-[-2px] sm:text-[40px] sm:leading-12 sm:tracking-[-3px] lg:max-w-127.75 lg:text-[65px] lg:leading-16.25 lg:tracking-[-4px]">
              Love the way they handle the order.
            </p>
          </div>

          <p className="text-[16px] leading-6.5 tracking-[-0.3px] text-white opacity-80 lg:max-w-127.5 lg:text-[18px]">
            Very professional and friendly at the same time. They packed the order on schedule and
            the detail of their wrapping is top notch. One of my best experience for buying online
            items. Surely will come back for another purchase.
          </p>

          <div className="flex items-center gap-4">
            <img
              src={testimonialAvatar}
              alt=""
              className="size-14 shrink-0 rounded-full object-cover lg:hidden"
            />
            <div className="text-white">
              <p className="text-[16px] font-semibold leading-6 tracking-[-0.5px] lg:text-[24px] lg:leading-8">
                Samantha William
              </p>
              <p className="text-[14px] leading-5.5 opacity-50">Fashion Enthusiast</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
