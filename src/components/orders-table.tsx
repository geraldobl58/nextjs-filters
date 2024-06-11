"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { foamttedPrice } from "@/lib/utils";

export type Props = {
  orders: {
    id: number;
    customer_name: string;
    customer_email: string;
    order_date: Date;
    amount_in_cents: number;
    status: string;
    created_at: Date;
    updated_at: Date;
  }[];
};

export default function OrdersTable({ orders }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (params.get("sort") === value) {
      params.set("sort", `-${value}`);
    } else if (params.get("sort") === `-${value}`) {
      params.delete("sort");
    } else if (value) {
      params.set("sort", value);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getSortIcon = (value: string) => {
    if (searchParams.get("sort") === value) {
      return <ChevronDown className="size-4" />;
    } else if (searchParams.get("sort") === `-${value}`) {
      return <ChevronUp className="size-4" />;
    }

    return <ChevronsUpDown className="size-4" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="w-full">
          <TableHead className="table-cell">Cliente</TableHead>
          <TableHead className="table-cell">Status</TableHead>
          <TableHead className="table-cell cursor-pointer justify-end items-center gap-1">
            <div
              className="flex items-center gap-1"
              onClick={() => handleClick("order_date")}
            >
              Data
              {getSortIcon("order_date")}
            </div>
          </TableHead>
          <TableHead
            className="text-right cursor-pointer flex justify-end items-center gap-1"
            onClick={() => handleClick("amount_in_cents")}
          >
            Valor
            {getSortIcon("amount_in_cents")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium">{item.customer_name}</div>
              <div className="hidden md:inline text-sm text-muted-foreground">
                {item.customer_email}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={`text-xs`} variant="outline">
                {item.status === "pending" ? "Pendente" : "Completo"}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {format(item.order_date, "dd-MM-yyyy")}
            </TableCell>
            <TableCell className="text-right">
              {foamttedPrice(item.amount_in_cents)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
