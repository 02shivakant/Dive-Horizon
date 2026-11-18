import Hero from "@/components/sections/Hero";
import DiveScene from "@/components/sections/DiveScene";
import Trailer from "@/components/sections/Trailer";
import Screenshots from "@/components/sections/Screenshots";
import GameplayStrip from "@/components/sections/GameplayStrip";
import Rewards from "@/components/sections/Rewards";

export default function Page() {
  return (
    <>
      <Hero />
      <DiveScene />
      {/* No trailer file yet? Add youtubeUrl="https://www.youtube.com/watch?v=XXXXXXXXXXX" as a fallback */}
      <Trailer />
      <Screenshots />
      <GameplayStrip />
      <Rewards />
    </>
  );
}
