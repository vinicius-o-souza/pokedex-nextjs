import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { getPokemonList, getPokemonTypes } from "@/lib/drupal/pokemon";
import { PokedexClient } from "@/components/PokedexClient";

export const metadata = {
  title: "Pokédex",
  description: "Browse the complete Pokédex.",
};

export default async function PokedexPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [initialData, types] = await Promise.all([
    getPokemonList(session.accessToken, { page: 0, pageSize: 20 }),
    getPokemonTypes(session.accessToken),
  ]);

  return <PokedexClient initialData={initialData} types={types} />;
}
