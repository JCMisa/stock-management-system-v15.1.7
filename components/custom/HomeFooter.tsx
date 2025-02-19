import Link from "next/link";
import React from "react";

const HomeFooter = () => {
  return (
    <div className="bg-light-100 dark:bg-dark-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6  text-dark dark:text-light flex flex-wrap justify-between">
        <div className="p-5">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
            Home
          </div>
          <Link className="my-3 block" href="/">
            Services <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Products <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            About Us <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Pricing <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Partners <span className="text-primary text-xs p-1">New</span>
          </Link>
        </div>
        <div className="p-5">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
            Resources
          </div>

          <Link className="my-3 block" href="/">
            Documentation <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Tutorials <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Support <span className="text-primary text-xs p-1">New</span>
          </Link>
        </div>
        <div className="p-5">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
            Support
          </div>

          <Link className="my-3 block" href="/">
            Help Center <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Privacy Policy <span className="text-primary text-xs p-1"></span>
          </Link>
          <Link className="my-3 block" href="/">
            Conditions <span className="text-primary text-xs p-1"></span>
          </Link>
        </div>
        <div className="p-5">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
            Contact us
          </div>

          <Link className="my-3 block" href="/">
            XXX XXXX, Floor 4 San Francisco, CA
            <span className="text-primary text-xs p-1"></span>
          </Link>

          <Link className="my-3 block" href="/">
            contact@company.com
            <span className="text-primary text-xs p-1"></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeFooter;
