"use client";

import { upload_image_api } from "@/api";
import { RootState } from "@/redux-store/redux_store";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UploadImageGetLink = () => {
  const [image, setImage] = useState<File | null>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const [imgLink, setImgLink] = useState("");
  const [loadings, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!image) {
        toast.error("Please select an image to upload");
        return;
      }

      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      const formPayload = new FormData();

      formPayload.append("image", image);


      setLoading(true);
      const { data } = await axios.post(upload_image_api, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Image uploaded successfully");

      setImgLink(data.filePath);
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-5">
      <div>
        <div className="flex justify-between items-start">
          <div className="">
            <label
              htmlFor="upimage"
              className="block text-gray-700  text-xl font-bold mb-4"
            >
              Upload your image & get URL
            </label>
            <input
              type="file"
              id="upimage"
              name="image"
              accept="image/*"
              className=" px-4 p-2 border border-gray-500 rounded-lg  focus:outline-none"
              onChange={handleImageChange}
            />
            {image && image instanceof File && (
              <div className="flex justify-center items-center mb-6 mt-4">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Local Image"
                  width={160}
                  height={120}
                  className="h-[120px] w-auto"
                  style={{ height: "120px", width: "auto" }}
                  unoptimized
                />
              </div>
            )}
          </div>


          {loadings ? (
            <button
              disabled
              type="button"
              className=" bg-primary text-white text-sm py-2 mt-7 px-4 rounded hover:shadow-2xl"
            >
              Loading..
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              type="button"
              className=" bg-primary text-white text-sm py-2 mt-7 px-4 rounded hover:shadow-2xl"
            >
              Get Link
            </button>
          )}
        </div>


      </div>
      {imgLink && (
        <div className="mt-4">
          <div className="flex items-center justify-start gap-5">
            <button
              onClick={() => {
                navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+imgLink);
                toast.success("Link copied to clipboard!");
              }}
              className="text-base rounded-full bg-gray-200 hover:bg-primary px-8 py-1 "
            >
              Click to Copy your Image Link
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UploadImageGetLink;
