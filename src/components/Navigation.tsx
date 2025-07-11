"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { InferSelectModel } from "drizzle-orm";
import { categoriesTable, typesTable } from "@/db/schema";
import { cn } from "@/lib/utils";

type Category = InferSelectModel<typeof categoriesTable>;
type Type = InferSelectModel<typeof typesTable>;

type NavigationData = (Type & {
  categories: Category[];
})[];

type NavigationProps = {
  navigationData: NavigationData;
};

export default function Navigation({ navigationData }: NavigationProps) {
  const otherLinks = [
    { href: "/new-drops", label: "NEW DROP" },
    { href: "/collabs", label: "COLLABS" },
    { href: "/lookbook", label: "LOOKBOOK" },
  ];

  return (
    <div className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          {navigationData.map((type) => (
            <NavigationMenuItem key={type.id}>
              <NavigationMenuTrigger>{type.name.toUpperCase()}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {type.categories.map((category) => (
                    <ListItem
                      key={category.id}
                      title={category.name}
                      href={`/category/${category.slug}`}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          {otherLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild>
                <Link href={link.href} className={navigationMenuTriggerStyle()}>
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 