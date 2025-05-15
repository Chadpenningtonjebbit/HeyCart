import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  redirect("/dashboard");
  return null;
}
