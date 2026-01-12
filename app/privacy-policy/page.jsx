import Container from "@/components/Container";

export const metadata = {
  title: "Privacy Policy",
  robots: {
    index: false,
  },
};

export default function PrivacyPolicy() {
  return (
    <Container>
      <div className="prose dark:prose-invert py-10 mx-auto">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          I do not collect any personal data from visitors. This website is for
          portfolio purposes only.
        </p>
      </div>
    </Container>
  );
}