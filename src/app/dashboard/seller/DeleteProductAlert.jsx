"use client";

import { useState } from "react";
import { AlertDialog, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/lib/actions/products";
import { toast } from "@heroui/react";

export default function DeleteProductAlert({ product }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProductAction(product._id);
      setIsOpen(false);
      toast.success("Product deleted permanently.");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.danger("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <button 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
        title="Delete Product"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
              <AlertDialog.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Delete Product</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="py-6">
              <p className="text-zinc-600 dark:text-zinc-400">
                Are you sure you want to delete <strong className="text-zinc-900 dark:text-white font-semibold">"{product?.title}"</strong>? This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
              <Button variant="flat" onPress={() => setIsOpen(false)} className="rounded-xl font-medium">
                Cancel
              </Button>
              <Button onPress={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors">
                {isDeleting ? <Spinner size="sm" color="white" /> : "Delete Permanently"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
