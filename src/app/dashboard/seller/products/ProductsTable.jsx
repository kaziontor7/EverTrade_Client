"use client";

import { useMemo, useState } from "react";
import { Avatar, Checkbox, Chip, Table } from "@heroui/react";
import EditProductModal from "../EditProductModal";
import DeleteProductAlert from "../DeleteProductAlert";

export default function ProductsTable({ products = [] }) {
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "title",
    direction: "ascending",
  });

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = a[col];
      const second = b[col];

      let cmp = 0;
      
      if (typeof first === "string" && typeof second === "string") {
        cmp = first.localeCompare(second);
      } else if (typeof first === "number" && typeof second === "number") {
        cmp = first - second;
      } else if (col === "createdAt") {
        const dateA = new Date(first).getTime();
        const dateB = new Date(second).getTime();
        cmp = dateA - dateB;
      } else if (typeof first === "boolean") {
        cmp = first === second ? 0 : first ? 1 : -1;
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [sortDescriptor, products]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="My Products Table"
          className="min-w-[800px]"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <Table.Header>
            <Table.Column allowsSorting isRowHeader id="title">
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Product
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="category">
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Category
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="price">
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Price
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="stock">
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Stock
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="isSold">
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Status
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column className="text-end">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {sortedProducts.map((product) => {
              const imageSrc = typeof product.images === 'string' 
                ? product.images 
                : (product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80");

              return (
                <Table.Row key={product._id} id={product._id}>
                  
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" radius="md">
                        <Avatar.Image src={imageSrc} />
                        <Avatar.Fallback>{product.title.substring(0,2)}</Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900 dark:text-white max-w-[200px] truncate" title={product.title}>
                          {product.title}
                        </span>
                        <span className="text-xs text-gray-500">{product.condition}</span>
                      </div>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-gray-600 dark:text-gray-300">
                    {product.category}
                  </Table.Cell>

                  <Table.Cell className="font-medium text-emerald-600 dark:text-emerald-400">
                    ${product.price}
                  </Table.Cell>

                  <Table.Cell className="text-gray-600 dark:text-gray-300">
                    {product.stock}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip color={product.isSold ? "danger" : "success"} size="sm" variant="soft">
                      {product.isSold ? "Sold" : "Available"}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center justify-end gap-2">
                      <EditProductModal product={product} />
                      <DeleteProductAlert product={product} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
