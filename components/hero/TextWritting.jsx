import { TextWritingEffect } from "@/components/ui/text-writing-effect";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export default function TextWriting() {
  return (
    <TextWritingEffect 
      text="mutasim fuad rimu" 
      fontClassName={pacifico.className} 
    />
  );
}