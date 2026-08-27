import { redirect } from "next/navigation";

/** Games hub reserved for later — send users to sports for now */
export default function GamesPage() {
  redirect("/sports");
}
