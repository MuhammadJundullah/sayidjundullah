"use client";

import React from "react";
import { Input } from "@/components/ui/input";

const EditProjects = () => {
  const handleSubmit = () => {
    return console.log("success");
  };

  return (
    <div className="sm:mx-auto mx-5 max-w-6xl flex flex-col justify-center text-black">
      <p className="text-2xl">Manage Projects</p>
      <form onSubmit={handleSubmit} className="py-3">
        <div className="flex flex-col gap-4">
          <Input type="text" placeholder="Nama Projek" />
          <Input type="text" placeholder="Category" />
          <Input type="text" placeholder="URL Repository Github" />
          <Input type="file" placeholder="Photo" />
          <Input type="text" placeholder="Teknologi terkait (framework dsb.)" />
          <Input type="text" placeholder="URL Deploy/Dashboard link" />
          <Input type="text" placeholder="Deskripsi" />
        </div>
      </form>
    </div>
  );
};

export default EditProjects;
