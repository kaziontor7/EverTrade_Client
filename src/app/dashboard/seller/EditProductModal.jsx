"use client";

import { useState } from "react";
import { Modal, Button, Spinner, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { updateProductAction } from "@/lib/actions/products";

export default function EditProductModal({ product }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      const isSold = formData.get("isSold") === "true";

      const finalData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        condition: data.condition,
        isSold: isSold,
        stock: isSold ? 0 : Number(data.stock),
      };

      await updateProductAction(product._id, finalData);
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button 
        onPress={() => setIsOpen(true)}
        isIconOnly size="sm" variant="tertiary"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-gray-900 dark:text-white">Edit Listing</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <form id={`edit-form-${product._id}`} onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Product Title</label>
                  <input 
                    name="title"
                    required
                    type="text" 
                    defaultValue={product.title}
                    className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                  <textarea 
                    name="description"
                    required
                    rows={3}
                    defaultValue={product.description}
                    className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Price ($)</label>
                  <input 
                    name="price"
                    required
                    type="number" 
                    defaultValue={product.price}
                    className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Stock</label>
                  <input 
                    name="stock"
                    required
                    type="number" 
                    defaultValue={product.stock}
                    className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Category</label>
                  <select 
                    name="category"
                    defaultValue={product.category}
                    className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Furniture</option>
                    <option>Automotive</option>
                    <option>Books</option>
                    <option>Vehicles</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Condition</label>
                  <select 
                    name="condition"
                    defaultValue={product.condition}
                    className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option>New</option>
                    <option>Like New</option>
                    <option>Used</option>
                    <option>Refurbished</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 text-sm text-gray-900 dark:text-white cursor-pointer mt-4 md:col-span-2">
                  <input 
                    type="checkbox" 
                    name="isSold" 
                    value="true"
                    defaultChecked={product.isSold} 
                    className="w-5 h-5 accent-emerald-500 rounded border-gray-300 dark:border-white/10 bg-gray-100/80 dark:bg-black/50 cursor-pointer"
                  />
                  Mark as Sold
                </label>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button form={`edit-form-${product._id}`} type="submit" color="success" className="bg-emerald-500 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" color="white" /> : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
