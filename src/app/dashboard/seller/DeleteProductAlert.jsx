"use client";

import { useState } from "react";
import { AlertDialog, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/lib/actions/products";

export default function DeleteProductAlert({ product }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProductAction(product._id);
      setIsOpen(false);
      // Wait for revalidation then refresh router to be safe
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button 
        onPress={() => setIsOpen(true)}
        isIconOnly size="sm" variant="danger-soft"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Heading className="text-xl font-bold text-gray-900 dark:text-white">Delete Product</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete &quot;{product.title}&quot;? This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="flat" onPress={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button color="danger" className="bg-red-500 text-white" onPress={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Spinner size="sm" color="white" /> : "Delete"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
