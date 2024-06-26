"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Product from "./components/Products";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import styles from "./styles/page.module.css";

export default function Home() {
  useEffect(() => {
    const scrollContainer = document.querySelector(`.${styles.productList}`);
    if (scrollContainer) {
      const duration = 20; // Duration in seconds
      const reset = () => {
        scrollContainer.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      };
      const intervalId = setInterval(reset, duration * 1000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col mx-auto items-center text-center max-w-3xl py-20">
        <h1 className="font-bold text-4xl tracking-tight text-gray-900 sm:text-6xl">
          Your marketplace for high-quality{" "}
          <span className="text-blue-600">products</span>.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          Welcome to Ping. Every asset on our platform is verified by our team to
          ensure our highest quality standards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/products" className={buttonVariants()}>
            Products
          </Link>
          <Button variant={"ghost"}>Our quality products &rarr;</Button>
        </div>
      </div>
      <div className={cn("grid grid-cols-1 gap-10 mt-6 lg:-ml-16", styles.productList)}>
        {Object.keys(Product).map((key, index) => (
          <div
            key={key}
            className={cn(
              "items-center p-4",
              styles.product
            )}
          >
            <div className="relative w-44 h-32">
              <Image
                src={Product[key].image}
                layout="fill"
                objectFit="cover"
                alt={Product[key].name}
                className="rounded-md"
              />
            </div>
            <h2 className="mt-2">{Product[key].name}</h2>
            <p>Price: {Product[key].price}</p>
            <p>Rating: {Product[key].rating}</p>
            <p>Description: {Product[key].description}</p>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
