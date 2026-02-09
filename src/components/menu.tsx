"use client";

import { ChevronRight, Star } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export interface MenuCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  beta?: boolean;
  available?: boolean;
}

interface MenuProps {
  title?: string;
  categories?: MenuCategory[];
  className?: string;
}

const Menu = ({
  title = process.env.appName || "Retro Toolbox",
  categories = [],
  className = "",
}: MenuProps) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container max-w-5xl">
        {/* Header with Search */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A collection of tools for developers and makers around Dofus retro.
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Categories Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link href={category.link} key={index} className="group">
              <Card
                key={index}
                className="group cursor-pointer gap-0 p-0 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{category.title}</h3>
                        {category.beta && <Badge variant="outline">beta</Badge>}
                        {category.available === false && (
                          <Badge variant="secondary">bientôt</Badge>
                        )}
                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Separator className="mb-12" />

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Code with ❤️️ by{" "}
            <a
              href={process.env.appAuthorGithub}
              target="_blank"
              className="underline"
            >
              {process.env.appAuthor}
            </a>
          </p>
          <Button className="mt-3">
            <Star data-icon="inline-start" />
            <a href={process.env.appRepository} target="_blank">
              Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Menu };
