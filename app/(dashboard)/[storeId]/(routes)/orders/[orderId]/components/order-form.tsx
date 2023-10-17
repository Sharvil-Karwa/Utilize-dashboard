"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Order} from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const formSchema = z.object({
  customer: z.string().min(2),
  customer_email: z.string().min(2).email(),
  product: z.string(),
  quantity: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Please enter a valid numerical value for quantity.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Quantity must be greater than zero.",
    }),
});

type OrdersFormValues = z.infer<typeof formSchema>

interface OrdersFormProps {
  initialData: Order | null;
};

export const OrdersForm: React.FC<OrdersFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit order' : 'Create order';
  const description = initialData ? 'Edit an order.' : 'Add a new order';
  const toastMessage = initialData ? 'Order updated.' : 'Order created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<OrdersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        customer: '',
        customer_email: '',
        product: '',
        quantity: ''
    }
  });

  const onSubmit = async (data: OrdersFormValues) => {
    try { 
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/orders`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/orders`)
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${params.orderId}`);
      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success('Order deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all departments using this order first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  } 

  const products = [
    {
      id: "Product 1",
      label : "Product 1"
    }, 
    {
      id: "Product 2",
      label : "Product 2"
    }, 
    {
      id: "Product 3",
      label : "Product 3"
    }
  ]

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
          <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Product</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={initialData ? initialData.product : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue>{products.find((p) => p.label === field.value)?.label}</SelectValue>
                        ) : (
                          <SelectValue>Select a product</SelectValue>
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
