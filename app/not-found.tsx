"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();

  return (
    /* From Uiverse.io by Praashoo7 */
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="main_wrapper-404">
        <div className="main-404">
          <div className="antenna-404">
            <div className="antenna_shadow-404"></div>
            <div className="a1-404"></div>
            <div className="a1d-404"></div>
            <div className="a2-404"></div>
            <div className="a2d-404"></div>
            <div className="a_base-404"></div>
          </div>
          <div className="tv-404">
            <div className="cruve-404">
              <svg
                className="curve_svg-404"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 189.929 189.929"
                xmlSpace="preserve"
              >
                <path
                  d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
        C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                ></path>
              </svg>
            </div>
            <div className="display_div-404">
              <div className="screen_out-404">
                <div className="screen_out1-404">
                  <div className="screen-404">
                    <span className="notfound_text-404"> NOT FOUND</span>
                  </div>
                  <div className="screenM-404">
                    <span className="notfound_text-404"> NOT FOUND</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lines-404">
              <div className="line1-404"></div>
              <div className="line2-404"></div>
              <div className="line3-404"></div>
            </div>
            <div className="buttons_div-404">
              <div className="b1-404">
                <div></div>
              </div>
              <div className="b2-404"></div>
              <div className="speakers-404">
                <div className="g1-404">
                  <div className="g11-404"></div>
                  <div className="g12-404"></div>
                  <div className="g13-404"></div>
                </div>
                <div className="g-404"></div>
                <div className="g-404"></div>
              </div>
            </div>
          </div>
          <div className="bottom-404">
            <div className="base1-404"></div>
            <div className="base2-404"></div>
            <div className="base3-404"></div>
          </div>
        </div>
        <div className="text_404-404">
          <div className="text_4041-404">4</div>
          <div className="text_4042-404">0</div>
          <div className="text_4043-404">4</div>
        </div>
      </div>
      <Button onClick={() => router.back()} className="min-w-52 max-w-52">
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
