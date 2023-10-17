/* eslint-disable react/no-unescaped-entities */


"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1),
});
export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true); 
      toast.success("Store created");
      const response = await axios.post('/api/stores', values);
      window.location.assign('/orders');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and orders."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="E-Commerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
               
                  {loading ? ( 
                    <div>
                      <div className="relative inline-block w-16 h-16">
                      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12">
                      </div>
                    </div>
                    <div className="text-red-500">
                      Your store is being populated with the dummy data, reload the page if you don't want to wait while the dummy data is loading
                    </div> 
                    </div>
                  ) : (
                    <div>
                      <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                    Cancel
                    </Button>
                    <Button disabled={loading} type="submit">
                      Continue
                    </Button>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
