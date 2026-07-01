"use client";

import { useState } from "react";
import { Modal, Button, Spinner, Checkbox, Form, Input, TextArea, Select, Label, ListBox, TextField, toast } from "@heroui/react";
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
      toast.success("Product updated successfully.");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.danger("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <button 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer w-8 h-8 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        title="Edit Product"
      >
        <span className="material-symbols-outlined text-[16px]">edit</span>
      </button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl max-w-2xl bg-white dark:bg-zinc-900">
            <Modal.CloseTrigger />
            <Modal.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
              <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Edit Listing</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-6">
              <Form id={`edit-form-${product._id}`} onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-6" validationBehavior="native">
                <TextField isRequired name="title" defaultValue={product.title} className="md:col-span-2 w-full">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Product Title</Label>
                  <Input 
                    type="text" 
                    className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                  />
                </TextField>
                
                <TextField isRequired name="description" defaultValue={product.description} className="md:col-span-2 w-full">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Description</Label>
                  <TextArea 
                    minRows={3}
                    className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                  />
                </TextField>

                <TextField isRequired name="price" defaultValue={product.price?.toString()} className="w-full">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Price ($)</Label>
                  <div className="relative flex items-center w-full">
                    <span className="absolute left-3 text-zinc-500">$</span>
                    <Input 
                      type="number" 
                      className="pl-7 w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                    />
                  </div>
                </TextField>

                <TextField isRequired name="stock" defaultValue={product.stock?.toString()} className="w-full">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Stock</Label>
                  <Input 
                    type="number" 
                    className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                  />
                </TextField>

                <Select 
                  name="category"
                  defaultSelectedKey={product.category || "Electronics"}
                  className="w-full"
                >
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Category</Label>
                  <Select.Trigger className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 flex justify-between items-center focus-within:border-zinc-900 dark:focus-within:border-white transition-colors">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Electronics" textValue="Electronics">Electronics<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Clothing" textValue="Clothing">Clothing<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Furniture" textValue="Furniture">Furniture<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Automotive" textValue="Automotive">Automotive<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Books" textValue="Books">Books<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Vehicles" textValue="Vehicles">Vehicles<ListBox.ItemIndicator /></ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select 
                  name="condition"
                  defaultSelectedKey={product.condition || "New"}
                  className="w-full"
                >
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Condition</Label>
                  <Select.Trigger className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 flex justify-between items-center focus-within:border-zinc-900 dark:focus-within:border-white transition-colors">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="New" textValue="New">New<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Like New" textValue="Like New">Like New<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Used" textValue="Used">Used<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Refurbished" textValue="Refurbished">Refurbished<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Good" textValue="Good">Good<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Fair" textValue="Fair">Fair<ListBox.ItemIndicator /></ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Checkbox 
                  name="isSold"
                  value="true"
                  defaultSelected={product.isSold}
                  color="default"
                  className="md:col-span-2 mt-2 font-medium"
                >
                  Mark as Sold Out (Resets stock to 0)
                </Checkbox>
              </Form>
            </Modal.Body>
            <Modal.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
              <Button form={`edit-form-${product._id}`} type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium w-full py-4 shadow-sm" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" color="white" /> : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
