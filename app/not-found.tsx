"use client";

import React from "react";
import BackButton from "./admin/_components/BackButton";

const Page = () => {
  return (
    <div className="sm:mx-auto mx-5 max-w-6xl flex flex-col justify-center">
      <div className="container sm:mx-auto py-8">
        <div className="justify-between items-center py-4 dark:text-white">
          <p className="text-4xl fw-bold">Page Not Found.</p>
          <div>
            <BackButton href="/#projects" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;