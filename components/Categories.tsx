"use client";

import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

type CategoryProps = {
  data: Category[];
};
const Categories = ({ data }: CategoryProps) => {
    const router=useRouter()
    const seachParams=useSearchParams()
    const categoryId=seachParams.get("categoryId")

    const handleClick=(id:string|undefined)=>{
        const query={categoryId:id}
        const url=qs.stringifyUrl({
            url:window.location.href,
            query,
        },{skipNull:true})
        router.push(url)
    }
  return (
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <button
        className={cn(
          `flex items-center text-center text-xs md:text-sm px-2
           md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
           !categoryId?"bg-primary/25":"bg-primary/10"
        )}
        onClick={()=>handleClick(undefined)}
      >Newest</button>
      {data.map((item)=>(
        <button
        onClick={()=>handleClick(item.id)}
        className={cn(
          `flex items-center text-center text-xs md:text-sm px-2
           md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
           item.id===categoryId?"bg-primary/25":"bg-primary/10"
        )}
      >{item.name}</button>
      ))}
    </div>
  );
};

export default Categories;
