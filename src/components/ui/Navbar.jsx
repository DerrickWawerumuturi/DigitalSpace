import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "@/app/styles/Navbar.module.css";
import NavItems from "../NavItems";
import { buttonVariants } from "./button";
import Cart from "../Cart";

const Navbar = () => {
  const user = null;
  return (
    <div className={styles.primary}>
      <MaxWidthWrapper>
        <header className="mt-2 border-b border-gray-500">
          <div className="ml-4 flex flex-row gap-4 lg:ml-0">
            <div className={cn("relative w-10 h-10 mb-3", styles.imgdiv)}>
              <Link href="/">
                <Image
                  src={"/digitalSpace.png"}
                  alt="digital space image"
                  objectFit="cover"
                  layout="fill"
                  className={cn("rounded-md mb-2", styles.img)}
                />
              </Link>
            </div>
            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
              <NavItems />
            </div>

            <div className={styles.navtons}>
              <div
                className={cn(
                  "hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6",
                  styles.div
                )}
              >
                {user ? null : (
                  <Link
                    href="/sign-in"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Sign in
                  </Link>
                )}
                {user ? null : (
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                )}
                {user ? (
                  <p></p>
                ) : (
                  <Link
                    href="sign-up"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Create Account
                  </Link>
                )}
                {user ? null : (
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                )}

                {user ? null : (
                  <div className="flex lg:ml-6">
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  </div>
                )}
                <div className="ml-4 mt-2 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </header>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
