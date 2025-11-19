"use client";

import React from "react";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const ProjectsLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/Employee_Portal/Service_Center.png"
          alt="Background"
          fill
          className="object-cover object-center brightness-[0.3]"
          quality={100}
        />
       
      </div>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default ProjectsLayout;
