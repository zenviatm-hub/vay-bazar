import { Link } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function CGUPage() {
  const t = await getTranslations("cgu")
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToHome")}
        </Link>
      </Button>

      <h1 className="mb-6 text-3xl font-bold text-foreground">{t("title")}</h1>

      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            {t("notice")}
          </p>
        </div>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">1. Objet</h2>
          <p>
            Vay Bazar est une plateforme communautaire de petites annonces destinée à faciliter les échanges de biens et
            services au sein de la communauté. Le site permet aux utilisateurs de publier des annonces, de rechercher
            des produits et services, et de communiquer entre eux.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">2. Inscription</h2>
          <p>
            Pour utiliser Vay Bazar, vous devez créer un compte en fournissant des informations exactes et à jour. Vous
            êtes responsable de la confidentialité de vos identifiants de connexion.
          </p>
          <p className="mt-2">Conditions d'inscription :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Être majeur (18 ans minimum)</li>
            <li>Fournir des informations véridiques</li>
            <li>Un seul compte par personne</li>
            <li>Respecter les présentes conditions d'utilisation</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">3. Publication d'annonces</h2>
          <p className="mb-2">En publiant une annonce, vous vous engagez à :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Fournir des informations exactes et honnêtes sur le produit ou service</li>
            <li>Utiliser des photos réelles de l'article</li>
            <li>Fixer un prix raisonnable</li>
            <li>Répondre aux messages dans un délai raisonnable</li>
            <li>Retirer l'annonce une fois l'article vendu</li>
          </ul>
          <p className="mt-3">
            <strong>Contenus interdits :</strong> Il est strictement interdit de publier des annonces pour des produits
            illégaux, contrefaits, volés, dangereux, ou portant atteinte aux droits d'autrui. Les annonces à caractère
            frauduleux, discriminatoire ou offensant sont également prohibées.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">4. Transactions</h2>
          <p>
            <strong>Vay Bazar est uniquement une plateforme de mise en relation.</strong> Nous ne sommes pas partie
            prenante dans les transactions entre utilisateurs.
          </p>
          <p className="mt-2">Responsabilités de l'acheteur et du vendeur :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Vous êtes seul responsable de vos transactions</li>
            <li>Privilégiez les rencontres en lieux publics et sûrs</li>
            <li>Vérifiez l'état de l'article avant tout paiement</li>
            <li>Ne communiquez jamais vos informations bancaires par message</li>
            <li>Méfiez-vous des offres trop alléchantes</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">5. Messagerie</h2>
          <p>La messagerie interne doit être utilisée de manière respectueuse :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Pas de harcèlement ni d'insultes</li>
            <li>Respect de la vie privée des autres utilisateurs</li>
            <li>Pas de spam ou de publicité non sollicitée</li>
            <li>Utilisation dans le cadre des annonces uniquement</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">6. Propriété intellectuelle</h2>
          <p>
            En publiant du contenu (photos, descriptions), vous garantissez en être le propriétaire ou avoir les droits
            nécessaires. Vous accordez à Vay Bazar une licence non exclusive pour afficher ce contenu sur la plateforme.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">7. Modération</h2>
          <p>
            Vay Bazar se réserve le droit de modérer, modifier ou supprimer tout contenu qui ne respecte pas les
            présentes conditions, sans préavis ni justification.
          </p>
          <p className="mt-2">Nous pouvons également :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Suspendre ou fermer un compte en cas de non-respect des règles</li>
            <li>Signaler aux autorités compétentes toute activité illégale</li>
            <li>Limiter l'accès à certaines fonctionnalités</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">8. Responsabilité et garanties</h2>
          <p>
            <strong>Limitation de responsabilité :</strong> Vay Bazar ne peut être tenu responsable des dommages directs
            ou indirects résultant de :
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>L'utilisation ou l'impossibilité d'utiliser le service</li>
            <li>Les transactions entre utilisateurs</li>
            <li>La qualité, la légalité ou la véracité des annonces</li>
            <li>Le comportement des utilisateurs</li>
            <li>Les pertes de données ou interruptions de service</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">9. Données personnelles</h2>
          <p>
            L'utilisation de vos données personnelles est régie par notre{" "}
            <Link href="/politique-confidentialite" className="text-primary hover:underline">
              {t("privacyPolicyLink")}
            </Link>
            , qui fait partie intégrante des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">10. Modification des CGU</h2>
          <p>
            Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront
            informés des modifications importantes par email ou notification sur le site. L'utilisation continue du
            service après modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">11. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis votre profil. Vay Bazar peut également résilier
            votre accès au service en cas de violation des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">12. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents
            français.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">13. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation :
            <br />
            <strong>Email :</strong>{" "}
            <a href="mailto:contact@vaybazar.fr" className="text-primary hover:underline">
              contact@vaybazar.fr
            </a>
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">{t("lastUpdate")}: {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  )
}
