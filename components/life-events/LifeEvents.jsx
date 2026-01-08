import Container from "@/components/Container";
import LifeEventList from "./life-event-list";

export const metadata = {
  title: "Life Events | Portfolio",
};

export default async function LifeEvents() {
  return (
    <Container>
      <div className="flex  flex-col gap-10">
        <div className="">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            life-events
          </h1>
          <p className="text-muted-foreground">
            events of my life are stored here.
          </p>
        </div>
        <LifeEventList />
      </div>
    </Container>
  );
}
