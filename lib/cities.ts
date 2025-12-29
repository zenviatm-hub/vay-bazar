import { supabase } from "@/lib/supabase"

export interface City {
  id: number
  name: string
  postalCode?: string
  department?: string
  region?: string
}

// Liste de villes par défaut (fallback si la table n'existe pas)
const defaultCities: City[] = [
  { id: 1, name: "Paris", postalCode: "75000", department: "Paris", region: "Île-de-France" },
  { id: 2, name: "Lyon", postalCode: "69000", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { id: 3, name: "Marseille", postalCode: "13000", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { id: 4, name: "Toulouse", postalCode: "31000", department: "Haute-Garonne", region: "Occitanie" },
  { id: 5, name: "Nice", postalCode: "06000", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { id: 6, name: "Nantes", postalCode: "44000", department: "Loire-Atlantique", region: "Pays de la Loire" },
  { id: 7, name: "Strasbourg", postalCode: "67000", department: "Bas-Rhin", region: "Grand Est" },
  { id: 8, name: "Montpellier", postalCode: "34000", department: "Hérault", region: "Occitanie" },
  { id: 9, name: "Bordeaux", postalCode: "33000", department: "Gironde", region: "Nouvelle-Aquitaine" },
  { id: 10, name: "Lille", postalCode: "59000", department: "Nord", region: "Hauts-de-France" },
  { id: 11, name: "Rennes", postalCode: "35000", department: "Ille-et-Vilaine", region: "Bretagne" },
  { id: 12, name: "Reims", postalCode: "51100", department: "Marne", region: "Grand Est" },
  { id: 13, name: "Le Havre", postalCode: "76600", department: "Seine-Maritime", region: "Normandie" },
  { id: 14, name: "Saint-Étienne", postalCode: "42000", department: "Loire", region: "Auvergne-Rhône-Alpes" },
  { id: 15, name: "Toulon", postalCode: "83000", department: "Var", region: "Provence-Alpes-Côte d'Azur" },
  { id: 16, name: "Grenoble", postalCode: "38000", department: "Isère", region: "Auvergne-Rhône-Alpes" },
  { id: 17, name: "Dijon", postalCode: "21000", department: "Côte-d'Or", region: "Bourgogne-Franche-Comté" },
  { id: 18, name: "Angers", postalCode: "49000", department: "Maine-et-Loire", region: "Pays de la Loire" },
  { id: 19, name: "Nîmes", postalCode: "30000", department: "Gard", region: "Occitanie" },
  { id: 20, name: "Villeurbanne", postalCode: "69100", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { id: 21, name: "Saint-Denis", postalCode: "93200", department: "Seine-Saint-Denis", region: "Île-de-France" },
  { id: 22, name: "Le Mans", postalCode: "72000", department: "Sarthe", region: "Pays de la Loire" },
  { id: 23, name: "Aix-en-Provence", postalCode: "13100", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { id: 24, name: "Clermont-Ferrand", postalCode: "63000", department: "Puy-de-Dôme", region: "Auvergne-Rhône-Alpes" },
  { id: 25, name: "Brest", postalCode: "29200", department: "Finistère", region: "Bretagne" },
  { id: 26, name: "Limoges", postalCode: "87000", department: "Haute-Vienne", region: "Nouvelle-Aquitaine" },
  { id: 27, name: "Tours", postalCode: "37000", department: "Indre-et-Loire", region: "Centre-Val de Loire" },
  { id: 28, name: "Amiens", postalCode: "80000", department: "Somme", region: "Hauts-de-France" },
  { id: 29, name: "Perpignan", postalCode: "66000", department: "Pyrénées-Orientales", region: "Occitanie" },
  { id: 30, name: "Metz", postalCode: "57000", department: "Moselle", region: "Grand Est" },
  { id: 31, name: "Besançon", postalCode: "25000", department: "Doubs", region: "Bourgogne-Franche-Comté" },
  { id: 32, name: "Boulogne-Billancourt", postalCode: "92100", department: "Hauts-de-Seine", region: "Île-de-France" },
  { id: 33, name: "Orléans", postalCode: "45000", department: "Loiret", region: "Centre-Val de Loire" },
  { id: 34, name: "Mulhouse", postalCode: "68100", department: "Haut-Rhin", region: "Grand Est" },
  { id: 35, name: "Caen", postalCode: "14000", department: "Calvados", region: "Normandie" },
  { id: 36, name: "Rouen", postalCode: "76000", department: "Seine-Maritime", region: "Normandie" },
  { id: 37, name: "Nancy", postalCode: "54000", department: "Meurthe-et-Moselle", region: "Grand Est" },
  { id: 38, name: "Argenteuil", postalCode: "95100", department: "Val-d'Oise", region: "Île-de-France" },
  { id: 39, name: "Montreuil", postalCode: "93100", department: "Seine-Saint-Denis", region: "Île-de-France" },
  { id: 40, name: "Nanterre", postalCode: "92000", department: "Hauts-de-Seine", region: "Île-de-France" },
]

// Fonction pour normaliser un nom de ville (enlever accents, mettre en minuscule)
function normalizeCityName(cityName: string): string {
  return cityName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .trim()
}

// Fonction pour trouver une ville par nom (avec fallback)
export function findCityByName(cityName: string, cities: City[] = defaultCities): City | null {
  if (!cityName) return null
  
  const normalized = normalizeCityName(cityName)
  
  // Chercher une correspondance exacte
  let city = cities.find((c) => normalizeCityName(c.name) === normalized)
  if (city) return city
  
  // Chercher une correspondance partielle (commence par)
  city = cities.find((c) => normalizeCityName(c.name).startsWith(normalized))
  if (city) return city
  
  // Chercher une correspondance partielle (contient)
  city = cities.find((c) => normalizeCityName(c.name).includes(normalized))
  if (city) return city
  
  return null
}

// Fonction pour charger les villes depuis Supabase
export async function getCities(): Promise<City[]> {
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("name")

    if (error) {
      // Codes d'erreur possibles :
      // PGRST116 : table n'existe pas
      // 42P01 : relation does not exist
      // 42501 : permission denied (RLS)
      const errorMessage = error.message || ""
      const errorCode = error.code || ""
      
      if (
        errorCode === "PGRST116" || 
        errorCode === "42P01" ||
        errorMessage.includes("does not exist") ||
        errorMessage.includes("Could not find the table")
      ) {
        console.warn("La table 'cities' n'existe pas encore dans Supabase ou le cache n'est pas à jour. Utilisation des villes par défaut.")
        return defaultCities
      }
      
      if (errorCode === "42501" || errorMessage.includes("permission denied") || errorMessage.includes("new row violates row-level security")) {
        console.warn("Problème de permissions RLS sur la table 'cities'. Vérifiez que la politique de lecture publique est créée.")
        return defaultCities
      }
      
      console.warn("Erreur lors du chargement des villes depuis Supabase:", errorCode, errorMessage)
      return defaultCities
    }

    if (!data || data.length === 0) {
      // Si la table existe mais est vide, utiliser les villes par défaut
      console.warn("La table 'cities' est vide. Utilisation des villes par défaut.")
      return defaultCities
    }

    // Succès : retourner les données de Supabase
    console.log(`✅ ${data.length} villes chargées depuis Supabase`)
    return data.map((city) => ({
      id: city.id,
      name: city.name,
      postalCode: city.postal_code,
      department: city.department,
      region: city.region,
    }))
  } catch (error: any) {
    console.error("Erreur getCities:", error)
    // En cas d'erreur, retourner les villes par défaut
    return defaultCities
  }
}

// Fonction pour formater un numéro de téléphone français
export function formatPhoneNumber(value: string): string {
  // Retirer tous les caractères non numériques sauf le +
  const cleaned = value.replace(/[^\d+]/g, "")
  
  // Si commence par +33, formater en +33 X XX XX XX XX
  if (cleaned.startsWith("+33")) {
    const digits = cleaned.slice(3).replace(/\D/g, "")
    if (digits.length <= 9) {
      const formatted = digits.match(/.{1,2}/g)?.join(" ") || digits
      return `+33 ${formatted}`
    }
  }
  
  // Si commence par 0, formater en 0X XX XX XX XX
  if (cleaned.startsWith("0")) {
    const digits = cleaned.replace(/\D/g, "")
    if (digits.length <= 10) {
      const formatted = digits.match(/.{1,2}/g)?.join(" ") || digits
      return formatted
    }
  }
  
  // Si commence par 33, ajouter le +
  if (cleaned.startsWith("33") && !cleaned.startsWith("+")) {
    const digits = cleaned.replace(/\D/g, "")
    if (digits.length === 11) {
      const formatted = digits.slice(2).match(/.{1,2}/g)?.join(" ") || digits.slice(2)
      return `+33 ${formatted}`
    }
  }
  
  return cleaned
}

// Fonction pour valider un numéro de téléphone français
export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return true // Optionnel
  
  const cleaned = phone.replace(/[^\d+]/g, "")
  
  // Format +33XXXXXXXXX (11 chiffres après +33)
  if (cleaned.startsWith("+33")) {
    return cleaned.length === 12 && /^\+33\d{9}$/.test(cleaned)
  }
  
  // Format 0XXXXXXXXX (10 chiffres commençant par 0)
  if (cleaned.startsWith("0")) {
    return cleaned.length === 10 && /^0\d{9}$/.test(cleaned)
  }
  
  // Format 33XXXXXXXXX (11 chiffres commençant par 33)
  if (cleaned.startsWith("33")) {
    return cleaned.length === 11 && /^33\d{9}$/.test(cleaned)
  }
  
  return false
}
