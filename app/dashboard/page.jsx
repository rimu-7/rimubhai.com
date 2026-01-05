import AuthForm from "@/components/auth/AuthForm";
import Dashboard from "@/components/Dashboard";
import { getCurrentUser } from "@/lib/auth";
import AboutForm from "../about/admin-about";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogManager from "../blogs/BlogManager";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <main className="min-h-screen p-8 max-w-4xl mx-auto">
        <Dashboard user={user} />

        <Tabs defaultValue="first" className="w-full">
          <TabsList
            className="
          flex
          flex-row
          sm:flex-col
          md:flex-row
          items-center
          gap-2
          sm:gap-3
          md:gap-4
          w-full
          md:justify-start
          overflow-x-auto
          scrollbar-hide
          px-2
        "
            aria-label="Main tabs"
          >
            <TabsTrigger value="about" className="whitespace-nowrap">
              About
            </TabsTrigger>
            <TabsTrigger value="blog" className="whitespace-nowrap">
              Blog
            </TabsTrigger>
            <TabsTrigger value="third" className="whitespace-nowrap">
              Third
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 w-full">
            <TabsContent value="about" className="p-4">
              <AboutForm />
            </TabsContent>

            <TabsContent value="blog" className="p-4">
              <BlogManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  );
}
