export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rimu Mutasim Fuad",
    "url": "https://rimubhai.com",
    "jobTitle": "Full Stack Developer",
    "sameAs": [
      "https://github.com/rimu-7",
      "https://x.com/__rimu7_",
      "https://www.linkedin.com/in/mutasim-fuad-rimu-36a4a8260"
    ],
    "knowsAbout": ["Next.js", "React", "JavaScript", "Web Development"]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}