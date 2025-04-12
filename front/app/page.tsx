import Link from "next/link";
import "./styles/globals.css";
import HomePage from "@/app/Home/page"

import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import userService from "./services/User";

export default async function Home() {

  const session = await getServerSession(options);
  if (!session) {
    redirect('/api/auth/signin');
  }
  else {
      console.log(session);
    }
    return (
      <div>
        <HomePage ></HomePage>

      </div>
    );
  }
