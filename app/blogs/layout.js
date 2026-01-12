export const metadata = {
  title: {
    default: "Blogs",
  },
  description: "A collection of thoughts and stories.",
};

export default function BlogsLayout({ children }) {
  return <main className="min-h-screen font-sans antialiased">{children}</main>;
}
