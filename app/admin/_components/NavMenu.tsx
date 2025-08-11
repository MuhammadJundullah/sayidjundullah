"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavMenu() {
  return (
    <div>
      <NavigationMenu viewport={false} className="z-1 hidden sm:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}>
              <Link
                href="/"
                target="_blank"
                className="dark:bg-gray-700 dark:text-white">
                Show Porto
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="dark:bg-gray-700 dark:text-white">
              Manage
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/admin/techstacks">
                      <div className="font-medium">Your Tech Stacks</div>
                      <div className="text-muted-foreground">
                        Manage your tech stack.
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link href="/admin/work-experiences">
                      <div className="font-medium">Your Work Experiences</div>
                      <div className="text-muted-foreground">
                        Learn how to use the library.
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link href="/admin/projects">
                      <div className="font-medium">Your Projects</div>
                      <div className="text-muted-foreground">
                        Browse all components in the library.
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link href="/admin/certificates">
                      <div className="font-medium">Your Certificates</div>
                      <div className="text-muted-foreground">
                        Read our latest blog posts.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/admin/educations">
                      <div className="font-medium">Your Educations</div>
                      <div className="text-muted-foreground">
                        Read our latest blog posts.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="dark:bg-gray-700 dark:text-white">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="#">About</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">Blog</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">Credits</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}>
              <Button
                onClick={async () => {
                  localStorage.removeItem("token");
                  await signOut({ redirect: false });
                  window.location.href = "/login";
                }}
                className="text-white bg-black dark:text-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-black hover:cursor-pointer">
                Logout
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="drawer sm:hidden">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-white w-full">
            <div className="flex-none sm:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"></label>
          <ul className="menu bg-white min-h-full w-80 p-4 space-y-2">
            <li>
              <Link
                href="/"
                target="_blank"
                className="font-bold hover:text-primary transition-colors">
                Show Porto &raquo;
              </Link>
            </li>
            <li className="font-bold text-lg mb-2">Manage</li>
            <li>
              <Link
                href="/admin/techstacks"
                className="font-medium hover:text-primary transition-colors">
                Your TechStacks
              </Link>
            </li>
            <li>
              <Link
                href="/admin/projects"
                className="font-medium hover:text-primary transition-colors">
                Your Projects
              </Link>
            </li>
            <li>
              <Link
                href="/admin/work-experiences"
                className="font-medium hover:text-primary transition-colors">
                Your Work Experiences
              </Link>
            </li>
            <li>
              <Link
                href="/admin/certificates"
                className="font-medium hover:text-primary transition-colors">
                Your Certificates
              </Link>
            </li>
            <li>
              <Link
                href="/admin/educations"
                className="font-medium hover:text-primary transition-colors">
                Your Educations
              </Link>
            </li>
            <li className="font-bold text-lg mt-6 mb-2">Features</li>
            <li>
              <Link
                href="#"
                className="font-medium hover:text-primary transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium hover:text-primary transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium hover:text-primary transition-colors">
                Credits
              </Link>
            </li>
            <li>
              <Button
                onClick={async () => {
                  localStorage.removeItem("token");
                  await signOut({ redirect: false });
                  window.location.href = "/login";
                }}
                className="w-full mt-4 text-white bg-black hover:bg-gray-800 hover:text-white hover:cursor-pointer">
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}