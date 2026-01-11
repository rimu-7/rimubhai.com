import Container from "@/components/Container";
import AwardList from "./awards-list";

export const metadata = {
  title: "Life Events | Portfolio",
};

export default async function Awards() {
  return (
    <div className="py-10">
      <div className="flex  flex-col">
        <div className="">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            honors and awards
          </h1>
          <p className="text-muted-foreground"></p>
        </div>
      </div>
      <AwardList />
    </div>
  );
}
