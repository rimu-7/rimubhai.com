import Container from "@/components/Container";

export const metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function PrivacyPolicy() {
  return (
    <Container>
      <section className="py-16 md:py-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:text-[15px]">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>I do not collect any personal data from visitors. This website is for portfolio purposes only.</p>
        </div>
      </section>
    </Container>
  );
}
