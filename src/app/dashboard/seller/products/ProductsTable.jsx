"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import EditProductModal from "../EditProductModal";
import DeleteProductAlert from "../DeleteProductAlert";

export default function ProductsTable({ products = [] }) {
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending",
  });

  const handleSort = (column) => {
    if (sortDescriptor.column === column) {
      setSortDescriptor({
        column,
        direction: sortDescriptor.direction === "ascending" ? "descending" : "ascending"
      });
    } else {
      setSortDescriptor({ column, direction: "ascending" });
    }
  };

  const getSortIcon = (column) => {
    if (sortDescriptor.column !== column) return "unfold_more";
    return sortDescriptor.direction === "ascending" ? "expand_less" : "expand_more";
  };

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
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-max">
        <thead>
          <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
            <th className="pb-4 px-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors select-none" onClick={() => handleSort("title")}>
              <div className="flex items-center gap-1">Product <span className="material-symbols-outlined text-[16px]">{getSortIcon("title")}</span></div>
            </th>
            <th className="pb-4 px-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors select-none" onClick={() => handleSort("category")}>
              <div className="flex items-center gap-1">Category <span className="material-symbols-outlined text-[16px]">{getSortIcon("category")}</span></div>
            </th>
            <th className="pb-4 px-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors select-none" onClick={() => handleSort("price")}>
              <div className="flex items-center gap-1">Price <span className="material-symbols-outlined text-[16px]">{getSortIcon("price")}</span></div>
            </th>
            <th className="pb-4 px-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors select-none" onClick={() => handleSort("stock")}>
              <div className="flex items-center gap-1">Stock <span className="material-symbols-outlined text-[16px]">{getSortIcon("stock")}</span></div>
            </th>
            <th className="pb-4 px-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors select-none" onClick={() => handleSort("isSold")}>
              <div className="flex items-center gap-1">Status <span className="material-symbols-outlined text-[16px]">{getSortIcon("isSold")}</span></div>
            </th>
            <th className="pb-4 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
          {sortedProducts.map((product) => {
            const imageSrc = typeof product.images === 'string' 
              ? product.images 
              : (product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80");

            return (
              <tr key={product._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black/50 overflow-hidden shadow-sm">
                      <Image 
                        src={imageSrc} 
                        alt={product.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 dark:text-white max-w-[200px] truncate" title={product.title}>{product.title}</span>
                      <span className="text-xs font-mono text-zinc-500">{product._id.substring(0,8)}...</span>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4 font-medium capitalize text-zinc-600 dark:text-zinc-400">
                  {product.category}
                </td>
                
                <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">
                  ${product.price?.toLocaleString()}
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-white">{product.stock || 0}</span>
                    {(product.stock === 0 || product.stock == null) && (
                      <span className="px-2 py-0.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider">Out</span>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                    product.isSold ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white' : 
                    'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700'
                  }`}>
                    {product.isSold ? 'Sold Out' : 'Active'}
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-3">
                    <EditProductModal product={product} />
                    <DeleteProductAlert product={product} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
