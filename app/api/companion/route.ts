import prismadb from "@/lib/prismadb"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try {
        const body = await req.json()
        const user=await currentUser()
        const {name,description,instructions,seed,src,categoryId}=body
        if(!user || !user.id||!user.firstName){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!name || !description || !instructions || !seed || !src || !categoryId){
            return new NextResponse("Bad Request",{status:400})
        }
        // Create companion functionality
        const companion=await prismadb.companion.create({
            data:{
                name,
                description,
                instructions,
                seed,
                src,
                categoryId,
                userId:user.id,
                userName:user.firstName
            }
        })
        return NextResponse.json(companion)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", {status:500})
    }
}