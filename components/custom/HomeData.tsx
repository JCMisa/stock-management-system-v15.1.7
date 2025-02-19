import React from "react";

const HomeData = () => {
  return (
    <div className="py-32 sm:py-60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl lg:text-5xl font-extrabold tracking-tight text-dark dark:text-light">
              Empowering Businesses Globally
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-500 dark:text-gray-400">
              Our platform is trusted by organizations worldwide to boost
              productivity, streamline operations, and enhance customer
              experiences.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col  p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                Active Users
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-dark dark:text-light">
                12,345
              </dd>
            </div>
            <div className="flex flex-col p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                Transactions Today
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-dark dark:text-light">
                1.23M
              </dd>
            </div>
            <div className="flex flex-col p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                Total Revenue
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-dark dark:text-light">
                $5.6B
              </dd>
            </div>
            <div className="flex flex-col  p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                Happy Customers
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-dark dark:text-light">
                98%
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default HomeData;
