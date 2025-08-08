"use client";

import Link from "next/link";
import {FaArrowLeft} from "react-icons/fa6";
import React from "react";

const Page = () => {
    return (
        <div className="sm:mx-auto mx-5 max-w-6xl flex flex-col justify-center">
            <div className="container sm:mx-auto py-8">
                <div className="justify-between items-center py-4">
                    <p className="text-4xl fw-bold">Page Not Found.</p>
                    <Link
                        href="/admin/projects"
                        className="flex hover:text-black text-gray-400">
                        <FaArrowLeft className="mt-1" />
                        <span className="ml-2">return back.</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Page;