import prismadb from "@/lib/prismadb"
import CompanionForm from "./components/companion-form"
import { auth } from "@clerk/nextjs/server"

type CompanionIdPageProps={
  params:{
    companionId:string,
  }
}


const CompanionIdPage = async({params}:CompanionIdPageProps) => {
const {userId}=auth()
if(!userId){
  return auth().redirectToSignIn() 
}
  const companion= await prismadb.companion.findUnique({
    where:{
      id:params.companionId,
      userId
    }
  })
  console.log(companion)
  const categories=await prismadb.category.findMany()
  return (
    <CompanionForm categories={categories} initialData={companion}/>
  )
}

export default CompanionIdPage