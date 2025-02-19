import HomeHero from "@/components/custom/HomeHero";
import HomeHeader from "@/components/custom/HomeHeader";
import HomeStep from "@/components/custom/HomeStep";
import HomeData from "@/components/custom/HomeData";
import HomeContact from "@/components/custom/HomeContact";
import HomeFooter from "@/components/custom/HomeFooter";
import { getCurrentUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import ModeToggle from "@/components/ModeToggle";

export default async function Home() {
  const user = await getCurrentUser();
  if (user?.data === null) return redirect("/sign-in");
  const currentUser = user?.data;

  return (
    <div className="bg-light dark:bg-dark">
      <HomeHeader user={currentUser} />
      <HomeHero user={currentUser} />
      <HomeStep />
      <HomeData />
      <HomeContact />
      <HomeFooter />
      <div className="fixed bottom-5 left-5">
        <ModeToggle />
      </div>
    </div>
  );
}
