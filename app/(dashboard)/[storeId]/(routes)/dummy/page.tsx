/* eslint-disable react/no-unescaped-entities */

"use client"

import axios from "axios"
import { toast } from "react-hot-toast"
import { Server, Table } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"



const page = () => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const onSubmit = async () => {
    try { 
      setLoading(true);
      const response = await axios.get(`/api/stores/${params.storeId}`)
      toast.success("Added dummy data")
      router.push(`/${params.storeId}/orders`);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        {!loading && <div className="flex flex-col items-center justify-between mt-10">
            <div className="text-red-500 mb-5"> By clicking on this button, your orders table would be populated with dummy data entries </div>
            <Button onClick={onSubmit} disabled={loading}>
                <Server className="mr-2 h-4 w-4" /> Get dummy data
            </Button>
        </div> }

        {loading && 
            <div className="flex flex-col items-center justify-between mt-10">
                <div className="text-green-600 mb-5"> 
                    Started populating dummy data into your orders table
                </div> 
                <Button onClick={()=>{router.push(`/${params.storeId}/orders`); alert("If all dummy orders haven't loaded, just refresh the page once!");}}>
                    <Table className="mr-2 h-4 w-4" />Back to orders page
                </Button>
        </div>}
    </>
  );
};

export default page