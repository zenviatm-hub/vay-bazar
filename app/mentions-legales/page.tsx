import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Mentions légales - Vay Bazar",
  description: "Mentions légales de la plateforme Vay Bazar",
}

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </Button>

      <h1 className="mb-6 text-3xl font-bold text-foreground">Mentions légales</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">1. Éditeur du site</h2>
          <p>Le site Vay Bazar est édité par [Nom de l'association/entreprise], [forme juridique].</p>
          <p className="mt-2">
            <strong>Siège social :</strong> [Adresse complète]
            <br />
            <strong>Email :</strong> contact@vaybazar.fr
            <br />
            <strong>Téléphone :</strong> [Numéro de téléphone]
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">2. Directeur de la publication</h2>
          <p>[Nom et Prénom du directeur de publication]</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">3. Hébergement</h2>
          <p>
            Ce site est hébergé par :
            <br />
            <strong>Vercel Inc.</strong>
            <br />
            340 S Lemon Ave #4133
            <br />
            Walnut, CA 91789
            <br />
            États-Unis
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, etc.) est la propriété exclusive
            de Vay Bazar, sauf mention contraire. Toute reproduction, distribution, modification ou exploitation, même
            partielle, sans autorisation préalable est strictement interdite et constitue une contrefaçon sanctionnée
            par le Code de la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">5. Responsabilité</h2>
          <p>
            Vay Bazar est une plateforme de mise en relation entre particuliers. Nous ne sommes pas responsables des
            transactions effectuées entre les utilisateurs, ni de la qualité, de la légalité ou de la véracité des
            annonces publiées.
          </p>
          <p className="mt-2">
            Les utilisateurs sont seuls responsables du contenu qu'ils publient et des transactions qu'ils effectuent.
            Vay Bazar se réserve le droit de supprimer toute annonce jugée inappropriée ou contraire aux conditions
            d'utilisation.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">6. Protection des données</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
            vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles
            vous concernant.
          </p>
          <p className="mt-2">
            Pour plus d'informations, consultez notre{" "}
            <Link href="/politique-confidentialite" className="text-primary hover:underline">
              Politique de confidentialité
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">7. Cookies</h2>
          <p>
            Ce site utilise des cookies nécessaires à son bon fonctionnement (authentification, préférences
            utilisateur). En naviguant sur ce site, vous acceptez l'utilisation de ces cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">8. Litiges</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  )
}
