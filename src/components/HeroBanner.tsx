import { Button } from "./ui/button";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://startupstockphotos.com/wp-content/uploads/2022/07/city-woman-fashion-1536x1024.jpeg)",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Summer Styles are Here
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            This season, our new summer collection will shelter you from the
            harsh elements of a world that doesn't care if you live or die.
          </p>
          <div className="mt-10">
            <Button asChild>
              <Link href="/#products">Shop Collection</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 