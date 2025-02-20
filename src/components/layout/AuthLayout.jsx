// src/components/layout/AuthLayout.jsx
import React from "react";
import { Folder, Image } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left side with background image or illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <div className="flex items-center space-x-2 mb-8">
            <Folder size={40} />
            <span className="text-2xl font-bold">ImageVault</span>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            Manage your images with ease
          </h1>

          <p className="text-xl mb-8">
            Upload, organize, and find your images in one secure place.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500 p-4 rounded-lg">
              <Folder className="mb-2" size={24} />
              <h3 className="font-medium mb-1">Nested folders</h3>
              <p className="text-sm text-blue-100">
                Organize your content just like your computer
              </p>
            </div>

            <div className="bg-blue-500 p-4 rounded-lg">
              <Image className="mb-2" size={24} />
              <h3 className="font-medium mb-1">Quick search</h3>
              <p className="text-sm text-blue-100">
                Find any image instantly with powerful search
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
