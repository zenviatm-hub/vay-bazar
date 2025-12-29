import { Link } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Trash2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic'

export default async function PolitiqueConfidentialitePage() {
  const t = await getTranslations("privacy")
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToHome")}
        </Link>
      </Button>

      <h1 className="mb-6 text-3xl font-bold text-foreground">{t("title")}</h1>

      <div className="mb-8 rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          {t("intro")}
        </p>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">1. Données collectées</h2>
          </div>
          <p className="mb-2">Nous collectons les données suivantes :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Données d'inscription :</strong> nom, prénom, email, numéro de téléphone, localisation
            </li>
            <li>
              <strong>Données des annonces :</strong> titre, description, prix, photos, catégorie
            </li>
            <li>
              <strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées
            </li>
            <li>
              <strong>Données de communication :</strong> messages échangés via la plateforme
            </li>
          </ul>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">2. Utilisation des données</h2>
          </div>
          <p className="mb-2">Vos données sont utilisées pour :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Publier et gérer vos annonces</li>
            <li>Faciliter la communication entre les membres de la communauté</li>
            <li>Améliorer nos services et l'expérience utilisateur</li>
            <li>Prévenir les fraudes et abus</li>
            <li>Vous envoyer des notifications importantes (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">3. Partage et protection des données</h2>
          </div>
          <p className="mb-2">
            <strong>Nous ne vendons jamais vos données personnelles.</strong>
          </p>
          <p className="mt-2">Vos données peuvent être partagées uniquement dans les cas suivants :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              Avec d'autres utilisateurs : les informations de votre profil public (nom, localisation, annonces) sont
              visibles par les autres membres
            </li>
            <li>
              Avec nos prestataires techniques : uniquement pour le fonctionnement de la plateforme (hébergement,
              sécurité)
            </li>
            <li>Si requis par la loi ou les autorités judiciaires</li>
          </ul>
          <p className="mt-3">
            <strong>Sécurité :</strong> Nous mettons en œuvre toutes les mesures techniques et organisationnelles
            appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
          </p>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">4. Vos droits (RGPD)</h2>
          </div>
          <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles
            </li>
            <li>
              <strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes
            </li>
            <li>
              <strong>Droit à l'effacement :</strong> demander la suppression de vos données
            </li>
            <li>
              <strong>Droit d'opposition :</strong> vous opposer au traitement de vos données
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré
            </li>
            <li>
              <strong>Droit de limitation :</strong> demander la limitation du traitement de vos données
            </li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:confidentialite@vaybazar.fr" className="text-primary hover:underline">
              confidentialite@vaybazar.fr
            </a>
          </p>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">5. Conservation des données</h2>
          </div>
          <p>
            Vos données personnelles sont conservées pendant toute la durée de votre utilisation de la plateforme. En
            cas de fermeture de compte, vos données sont supprimées dans un délai de 30 jours, sauf obligation légale de
            conservation.
          </p>
          <p className="mt-2">
            Les annonces expirées ou supprimées sont conservées 90 jours avant suppression définitive.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">6. Cookies et traceurs</h2>
          
          <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">6.1. Cookies essentiels</h3>
          <p>Nous utilisons des cookies essentiels nécessaires au bon fonctionnement du site :</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Cookies de session :</strong> pour maintenir votre connexion et votre authentification
            </li>
            <li>
              <strong>Cookies de préférence :</strong> pour mémoriser vos choix (langue, filtres)
            </li>
          </ul>
          <p className="mt-2">
            Ces cookies sont nécessaires au bon fonctionnement du site et ne peuvent pas être désactivés.
          </p>

          <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">6.2. Mesure d'audience (Vercel Analytics)</h3>
          <p>
            Nous utilisons <strong>Vercel Analytics</strong> pour mesurer l'audience de notre site et améliorer l'expérience utilisateur.
          </p>
          <p className="mt-2">
            <strong>Important :</strong> Vercel Analytics ne utilise <strong>pas de cookies</strong>. Il collecte des données anonymisées via un système de hachage :
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Pages visitées et parcours de navigation</li>
            <li>Référents (sites d'origine)</li>
            <li>Données techniques anonymisées (localisation générale, système d'exploitation, navigateur)</li>
            <li>Durée de visite et interactions</li>
          </ul>
          <p className="mt-2">
            Ces données sont <strong>entièrement anonymisées</strong> et ne permettent pas de vous identifier personnellement. 
            L'identifiant utilisé est généré par hachage et est automatiquement réinitialisé chaque jour.
          </p>
          <p className="mt-2">
            Vous pouvez refuser cette collecte de données via le bandeau de consentement affiché lors de votre première visite.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">7. Mineurs</h2>
          <p>
            Vay Bazar est réservé aux personnes majeures (18 ans et plus). Nous ne collectons pas sciemment de données
            personnelles auprès de mineurs.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">8. Modifications de cette politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. En cas de
            modification importante, nous vous en informerons par email ou via une notification sur le site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">9. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou l'utilisation de vos données
            personnelles, contactez-nous :
          </p>
          <p className="mt-2">
            <strong>Email :</strong>{" "}
            <a href="mailto:confidentialite@vaybazar.fr" className="text-primary hover:underline">
              confidentialite@vaybazar.fr
            </a>
            <br />
            <strong>Adresse :</strong> [Adresse postale]
          </p>
          <p className="mt-3">
            Vous pouvez également déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et
            des Libertés) si vous estimez que vos droits ne sont pas respectés.
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  )
}
