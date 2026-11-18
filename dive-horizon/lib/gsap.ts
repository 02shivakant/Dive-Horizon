import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

// Register plugins ONCE here. Always import gsap from "@/lib/gsap", never from "gsap".
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);
}

export { gsap, ScrollTrigger, Flip, useGSAP };
