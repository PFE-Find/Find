import Link from "next/link";
import "./styles/globals.css";
import HomePage from "@/app/Home/page"

import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Home() {

  const session = await getServerSession(options);
  
  
    return (
      <div>
        
      <HomePage session={session}/> 
   

      </div>
    );
  }
