"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";

type Props = {
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
  lastPage: number;
};

export default function Pagination({ links, lastPage }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClickPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber > 1) {
      if (pageNumber > lastPage) {
        params.set("page", lastPage.toString());
      } else {
        params.set("page", pageNumber.toString());
      }
    } else {
      params.delete("page");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <PaginationComponent>
      <PaginationContent>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            handleClickPage(Number(searchParams.get("page") || 1) - 1)
          }
        >
          <PaginationPrevious />
        </Button>
        {links.map((link, index) => {
          if (
            link.label.includes("Anterior") ||
            link.label.includes("Próximo")
          ) {
            return null;
          }

          if (link.label === "...") {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={link.active}
                onClick={() => handleClickPage(Number(link.label))}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className="cursor-pointer"
              />
            </PaginationItem>
          );
        })}

        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            handleClickPage(Number(searchParams.get("page") || 1) + 1)
          }
        >
          <PaginationNext />
        </Button>
      </PaginationContent>
    </PaginationComponent>
  );
}
