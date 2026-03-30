import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { getPokemonList, getPokemonTypes, getPokemonGenerations } from "@/lib/drupal/pokemon";
import { DrupalApiError } from "@/lib/drupal/client";
import { PokedexClient } from "@/components/PokedexClient";

export const metadata = {
  title: "Pokédex",
  description: "Browse the complete Pokédex.",
};

export default async function PokedexPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.error) {
    redirect("/login");
  }

  try {
    const [initialData, types, generations] = await Promise.all([
      getPokemonList(session.accessToken, { page: 0, pageSize: 20 }),
      getPokemonTypes(session.accessToken),
      getPokemonGenerations(session.accessToken),
    ]);

    return <PokedexClient initialData={initialData} types={types} generations={generations} />;
  } catch (err) {
    if (err instanceof DrupalApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }
}
