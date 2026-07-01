"use client";

import { useState } from "react";
import { toast, Button, Form, Input, TextArea, Select, Label, ListBox, TextField } from "@heroui/react";
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 md:p-8">
        <div className="border-b border-zinc-200 dark:border-zinc-800/50 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            List Product
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Publish a new item to the marketplace</p>
        </div>

        <Form className="w-full" onSubmit={onSubmit} validationBehavior="native">
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            
            {/* Left Column: Image Upload */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm min-h-[350px] flex flex-col items-center justify-center relative group overflow-hidden">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-center px-4">
                    <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-3">add_photo_alternate</span>
                    <p className="text-zinc-900 dark:text-white font-medium text-sm">Cover Photo</p>
                    <p className="text-zinc-500 text-xs mt-1">Click to upload</p>
                  </div>
                )}
                <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" onChange={handleImageChange} required />
                
                {previewUrl && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium text-sm">Change Image</span>
                  </div>
                )}
              </div>
              
              {previewUrl && (
                <Button type="button" variant="flat" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-medium mt-2" onPress={() => { setSelectedImage(null); setPreviewUrl(null); }}>
                  Remove Image
                </Button>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <TextField isRequired name="title" className="w-full">
                <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Product Title</Label>
                <Input
                  placeholder="e.g. MacBook Pro M1 2020"
                  className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                />
              </TextField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <Select isRequired name="category">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Category</Label>
                  <Select.Trigger className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 flex justify-between items-center focus-within:border-zinc-900 dark:focus-within:border-white transition-colors">
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
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Condition</Label>
                  <Select.Trigger className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 flex justify-between items-center focus-within:border-zinc-900 dark:focus-within:border-white transition-colors">
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

                <TextField isRequired name="price" className="w-full">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Price ($)</Label>
                  <div className="relative flex items-center w-full">
                    <span className="absolute left-3 text-zinc-500">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="pl-7 w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                    />
                  </div>
                </TextField>

                <TextField isRequired name="stock" className="w-full">
                  <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Stock Quantity</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    min="1"
                    className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                  />
                </TextField>
              </div>

              <TextField isRequired name="description" className="w-full">
                <Label className="text-zinc-900 dark:text-white font-medium text-sm pb-1">Description</Label>
                <TextArea
                  placeholder="Describe your product in detail..."
                  minRows={4}
                  className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors"
                />
              </TextField>

              <div className="flex gap-4 mt-4 w-full">
                <Button
                  type="submit"
                  className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-md h-12 rounded-xl transition-colors shadow-sm"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish Item"}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
