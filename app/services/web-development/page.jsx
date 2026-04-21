import { webDevData } from "@/app/data/web-dev";
import ServicePageTemplate from "@/components/services/ServicePage";


export default function WebDevelopmentPage() {
  return <ServicePageTemplate data={webDevData} />;
}
