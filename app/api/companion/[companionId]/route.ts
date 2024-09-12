import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, instructions, seed, src, categoryId } = body;

    if (!params.companionId) {
      return new NextResponse("Companion not found", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !src ||
      !categoryId
    ) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const isPro=await checkSubscription ()
        if(!isPro)return new NextResponse("Pro Subscription Required",{status:400})
    // Create companion functionality
    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        userId: user.id,
      },
      data: {
        name,
        description,
        instructions,
        seed,
        src,
        categoryId,
        userId: user.id,
        userName: user.firstName,
      },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      companionId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log('[COMPANION DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
