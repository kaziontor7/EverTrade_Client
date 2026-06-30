"use client";

import { useState } from "react";
import { toast, Button, Spinner, Form, Input, TextArea, Select, Label, ListBox, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";
import { uploadToImgBB } from "@/lib/api/uploadToImgBB";

import { useSession } from "@/lib/auth-client";
import { createProduct } from "@/lib/actions/products";

export default function AddProduct() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categories = [
    { key: "Electronics", label: "Electronics" },
    { key: "Furniture", label: "Furniture" },
    { key: "Clothing", label: "Clothing" },
    { key: "Books", label: "Books" },
    { key: "Vehicles", label: "Vehicles" },
  ];

  const conditions = [
    { key: "New", label: "New" },
    { key: "Like New", label: "Like New" },
    { key: "Used", label: "Used" },
    { key: "Refurbished", label: "Refurbished" },
  ];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // 1. Upload image to ImgBB
      let imageUrl = "";
      if (selectedImage) {
        imageUrl = await uploadToImgBB(selectedImage);
      } else {
        throw new Error("Please select a product image.");
      }

      // 2. Prepare product data
      const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        condition: formData.get("condition"),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        images: imageUrl,
        sellerId: session?.user?.id || "user_123",
        sellerName: session?.user?.name || "Seller",
        sellerLocation: session?.user?.location || "Bangladesh"
      };


      // 3. Save product via API
      const res = await createProduct(productData);
      console.log(res)
      if (res.acknowledged || res.success) {
        toast.success("Product successfully created!");
        router.push("/dashboard/seller/products");
      } else {
        toast.danger(res.message || "Failed to create product");
      }

    } catch (error) {
      console.error(error);
      toast.danger(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Add New Product</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new listing for your store.</p>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8">
        <Form className="w-full flex flex-col gap-6" onSubmit={onSubmit} validationBehavior="native">

          {/* Image Upload */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Product Image *</label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors overflow-hidden relative">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-3xl mb-1">add_photo_alternate</span>
                    <p className="text-xs">Upload</p>
                  </div>
                )}
                <input type="file" name="image" className="hidden" accept="image/*" onChange={handleImageChange} required />
              </label>
              {previewUrl && (
                <Button type="button" size="sm" variant="flat" color="danger" onPress={() => { setSelectedImage(null); setPreviewUrl(null); }}>
                  Remove
                </Button>
              )}
            </div>
          </div>

          <TextField isRequired name="title">
            <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Product Title</Label>
            <Input
              placeholder="e.g. MacBook Pro M1 2020"
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3"
            />
          </TextField>

          <TextField isRequired name="description">
            <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Description</Label>
            <TextArea
              placeholder="Describe your product in detail..."
              minRows={4}
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3"
            />
          </TextField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Select isRequired name="category">
              <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Category</Label>
              <Select.Trigger className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3 flex justify-between items-center">
                <Select.Value placeholder="Select a category" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.key} id={cat.key} textValue={cat.label}>
                      {cat.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select isRequired name="condition">
              <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Condition</Label>
              <Select.Trigger className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3 flex justify-between items-center">
                <Select.Value placeholder="Select condition" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {conditions.map((cond) => (
                    <ListBox.Item key={cond.key} id={cond.key} textValue={cond.label}>
                      {cond.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField isRequired name="price">
              <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Price ($)</Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 text-sm">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="pl-8 w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2"
                />
              </div>
            </TextField>

            <TextField isRequired name="stock">
              <Label className="text-gray-900 dark:text-gray-200 font-medium pb-1">Stock Quantity</Label>
              <Input
                type="number"
                placeholder="1"
                min="1"
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:border-emerald-500 transition-colors shadow-sm rounded-lg py-2 px-3"
              />
            </TextField>
          </div>

          <div className="flex gap-4 mt-4 w-full">
            <Button
              type="submit"
              color="success"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-md h-14 rounded-xl shadow-lg shadow-emerald-500/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" color="white" /> Publishing...
                </span>
              ) : (
                "Publish Listing"
              )}
            </Button>
            <Button
              type="button"
              variant="flat"
              className="flex-1 h-14 rounded-xl font-medium"
              onPress={() => router.push("/dashboard/seller")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
