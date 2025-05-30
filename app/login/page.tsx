import React from 'react'
import { Suspense } from "react";
import Loading from '../_components/Loading';
import InputForm  from './_components/InputForm'

const loginPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="h-screen items-center mx-auto max-w-lg justify-center flex flex-col">
        <div className="py-5 gap-2 flex flex-col ">
          <h1 className="text-3xl font-bold ">
            <span className="bg-black text-white px-2 rounded-lg">
              Sayid&apos;s
            </span>
            <span> Portofolio admin.</span>
          </h1>
          {/* <span className="top-2 font-light">Build with Next.</span> */}
        </div>
        <InputForm />
      </div>
    </Suspense>
  );
}

export default loginPage