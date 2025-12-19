
import { redirect } from "next/navigation";

export default function Home() {
  // For MVP, redirect to projects page as the main dashboard
  redirect("/projects");
}
