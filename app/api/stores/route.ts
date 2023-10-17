import fs from 'fs/promises';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      }
    });

    // Use the relative path to 'DummyData.json' at the root level of your project
    const jsonFilePath = 'DummyData.json';

    const jsonData = await fs.readFile(jsonFilePath, 'utf8');
    const orders = JSON.parse(jsonData);

    // Create the orders for the new store
    for (const order of orders) {
      const { customer_name, customer_email, product, quantity } = order;

      await prismadb.order.create({
        data: {
          customer: customer_name,
          customer_email,
          product,
          quantity: quantity.toString(),
          storeId: store.id,
        },
      });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
