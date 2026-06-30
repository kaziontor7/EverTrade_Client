"use client";

import { useState } from "react";
import { Modal, Button, Spinner, Checkbox, Form, Input, TextArea, Select, Label, ListBox, TextField } from "@heroui/react";
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
              <Form id={`edit-form-${product._id}`} onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4" validationBehavior="native">
                <TextField isRequired name="title" defaultValue={product.title} className="md:col-span-2">
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Product Title</Label>
                  <Input 
                    type="text" 
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3"
                  />
                </TextField>
                
                <TextField isRequired name="description" defaultValue={product.description} className="md:col-span-2">
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Description</Label>
                  <TextArea 
                    minRows={3}
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3"
                  />
                </TextField>

                <TextField isRequired name="price" defaultValue={product.price?.toString()}>
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Price ($)</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-500 text-sm">$</span>
                    <Input 
                      type="number" 
                      className="pl-8 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                    />
                  </div>
                </TextField>

                <TextField isRequired name="stock" defaultValue={product.stock?.toString()}>
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Stock</Label>
                  <Input 
                    type="number" 
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3"
                  />
                </TextField>

                <Select 
                  name="category"
                  defaultSelectedKey={product.category || "Electronics"}
                >
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Category</Label>
                  <Select.Trigger className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3 flex justify-between items-center">
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
                >
                  <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Condition</Label>
                  <Select.Trigger className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3 flex justify-between items-center">
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
                  color="success"
                  className="md:col-span-2 mt-2"
                >
                  Mark as Sold
                </Checkbox>
              </Form>
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
