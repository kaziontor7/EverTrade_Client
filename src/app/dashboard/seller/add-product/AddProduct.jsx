"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Select, Label, ListBox, TextArea, Spinner } from "@heroui/react";
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
      if (res.acknowledged) {
        alert("Product successfully created!");
        router.push("/dashboard/seller/products");
      } else {
        alert(res.message);
      }

    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
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
        <Form className="w-full flex flex-col gap-6" onSubmit={onSubmit}>

          {/* Image Upload */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Image *</label>
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

          <Input
            isRequired
            name="title"
            label="Product Title"
            labelPlacement="outside"
            placeholder="e.g. MacBook Pro M1 2020"
            variant="bordered"
            radius="lg"
            classNames={{
              label: "text-gray-700 dark:text-gray-300 font-medium",
            }}
          />

          <TextArea
            isRequired
            name="description"
            label="Description"
            labelPlacement="outside"
            placeholder="Describe your product in detail..."
            variant="bordered"
            radius="lg"
            minRows={4}
            classNames={{
              label: "text-gray-700 dark:text-gray-300 font-medium",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Select name="category" isRequired>
              <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-1 block">Category</Label>
              <Select.Trigger className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500">
                <Select.Value placeholder="Select a category" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-1 w-full">
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.key} id={cat.key} textValue={cat.label} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer rounded-lg">
                      <Label className="cursor-pointer">{cat.label}</Label>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select name="condition" isRequired>
              <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-1 block">Condition</Label>
              <Select.Trigger className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500">
                <Select.Value placeholder="Select condition" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-1 w-full">
                  {conditions.map((cond) => (
                    <ListBox.Item key={cond.key} id={cond.key} textValue={cond.label} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer rounded-lg">
                      <Label className="cursor-pointer">{cond.label}</Label>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Input
              isRequired
              name="price"
              type="number"
              label="Price ($)"
              labelPlacement="outside"
              placeholder="0.00"
              variant="bordered"
              radius="lg"
              min={1}
              step={0.01}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              classNames={{
                label: "text-gray-700 dark:text-gray-300 font-medium",
              }}
            />

            <Input
              isRequired
              name="stock"
              type="number"
              label="Stock Quantity"
              labelPlacement="outside"
              placeholder="1"
              variant="bordered"
              radius="lg"
              min={1}
              classNames={{
                label: "text-gray-700 dark:text-gray-300 font-medium",
              }}
            />
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
