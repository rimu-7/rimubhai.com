import AuthForm from "@/components/auth/AuthForm";
import Dashboard from "@/components/Dashboard";
import { getCurrentUser } from "@/lib/auth";
import AboutForm from "../about/admin-about";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <main className="min-h-screen p-8 max-w-4xl mx-auto">
        <Dashboard user={user} />
        <AboutForm />

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
            <TabsTrigger value="first" className="whitespace-nowrap">
              First
            </TabsTrigger>
            <TabsTrigger value="second" className="whitespace-nowrap">
              Second
            </TabsTrigger>
            <TabsTrigger value="third" className="whitespace-nowrap">
              Third
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 w-full">
            <TabsContent value="first" className="p-4">
              <div className="text-sm sm:text-base">
                Content for the first tab.
              </div>
            </TabsContent>

            <TabsContent value="second" className="p-4">
              <div className="text-sm sm:text-base">
                Content for the second tab.
              </div>
            </TabsContent>

            <TabsContent value="third" className="p-4">
              <div className="text-sm sm:text-base">
                Content for the third tab.
              </div>
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
