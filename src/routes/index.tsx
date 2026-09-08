import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/lumen/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Studio />;
}
