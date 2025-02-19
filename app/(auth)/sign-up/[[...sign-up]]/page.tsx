import Spinner from "@/components/custom/Spinner";
import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const SignUpPage = () => {
  return (
    <section className="">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-dark lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt="sample"
            src="/empty-img.png"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            width={1000}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-light" href="#">
              <span className="sr-only">Home</span>
              <Image
                src="/logo.svg"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/blur.jpg"
                alt="logo"
                width="50"
                height="40"
              />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-light sm:text-3xl md:text-4xl">
              Welcome Back to RHU
            </h2>

            <p className="mt-4 leading-relaxed text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              consequuntur quia voluptatem laudantium maxime repellendus ab
              iusto non cupiditate distinctio iure, vero voluptas eaque dolorum
              consequatur neque minima perferendis. Tenetur?
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden mb-10">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-dark-100 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <Image
                  src="/logo.svg"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/blur.jpg"
                  alt="logo"
                  width={1000}
                  height={1000}
                  className="h-10 w-10 sm:h-20 sm:w-20"
                />
              </a>

              <h1 className="mt-2 text-2xl font-bold text-light sm:text-3xl md:text-4xl">
                Welcome Back to RHU 👋
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Your personal AI health assistant is ready to assist. Log in to
                access your health insights and personalized plans. Let&apos;s
                continue your journey towards better health together.
              </p>
            </div>

            <div className="ml-20 lg:ml-0">
              <ClerkLoading>
                <Spinner />
              </ClerkLoading>
              <ClerkLoaded>
                <SignUp />
              </ClerkLoaded>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignUpPage;
