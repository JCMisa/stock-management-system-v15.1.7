import Image from "next/image";
import React from "react";
import Link from "next/link";

const HomeHero = ({ user }: { user: UserType }) => {
  return (
    <div className="relative overflow-hidden mt-10">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="font text-4xl font-bold tracking-tight text-dark dark:text-light sm:text-6xl">
              Svelte signals are finally here
            </h1>
            <p className="my-4 text-xl text-gray-500 dark:text-gray-400">
              This year, our new svelte signals will shelter you from the harsh
              elements of a world that doesn&apos;t care if you develop or die.
            </p>
            {user ? (
              <Link
                href={"/dashboard"}
                className="inline-block rounded-md border border-transparent bg-primary py-3 px-8 text-center font-medium hover:bg-primary/90"
              >
                Get Started
              </Link>
            ) : (
              <Link
                href={"/sign-in"}
                className="inline-block rounded-md border border-transparent bg-primary py-3 px-8 text-center font-medium hover:bg-primary/90"
              >
                Get Started
              </Link>
            )}
          </div>
          <div>
            <div className="mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <Image
                          src="https://media.gettyimages.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://media.gettyimages.com/id/104117230/photo/portable-hospital-bed-in-hallway.jpg?s=612x612&w=0&k=20&c=mMEPvzceBbBUCsr1c-OULgFUOaQ6HuL3M04xcANmJ3M="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://media.gettyimages.com/id/173799627/photo/study-of-architectural-form-05.jpg?s=612x612&w=0&k=20&c=rrHldo5akJRAeGjm_5ICkzZrTooEYLcww1BkMeCc7Y0="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://media.gettyimages.com/id/592647720/photo/vigilantly-monitoring-his-patients-vitals.jpg?s=612x612&w=0&k=20&c=cKQ6XPw8X98Z-9XQDR0DqnpTdvFsiHiXzYptGbKdD40="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://media.gettyimages.com/id/1022793180/photo/doctor-writing-on-clipboard.jpg?s=612x612&w=0&k=20&c=JoaEbn_JerajEi0qTMq66u_2trcSIUNgTcjrdkhWbRc="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://media.gettyimages.com/id/1152347310/photo/her-knowledge-is-impressing.jpg?s=612x612&w=0&k=20&c=XnPlcanD47an8eeTm_rg8vrkWd4eSRy-zHiM7BBX8zM="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://media.gettyimages.com/id/1473559425/photo/female-medical-practitioner-reassuring-a-patient.jpg?s=612x612&w=0&k=20&c=kGbm-TE5qdppyyiteyip7_CzKLktyPrRuWD4Zz2EcqE="
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/blur.jpg"
                          alt="grid"
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
