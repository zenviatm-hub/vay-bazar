-- Table des villes pour organiser les annonces
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  postal_code VARCHAR(10),
  department VARCHAR(100),
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_postal_code ON cities(postal_code);

-- Activer RLS (Row Level Security)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique de toutes les villes
CREATE POLICY "Allow public read access to cities" ON cities
  FOR SELECT
  USING (true);

-- Insertion des principales villes françaises
INSERT INTO cities (name, postal_code, department, region) VALUES
('Paris', '75000', 'Paris', 'Île-de-France'),
('Lyon', '69000', 'Rhône', 'Auvergne-Rhône-Alpes'),
('Marseille', '13000', 'Bouches-du-Rhône', 'Provence-Alpes-Côte d''Azur'),
('Toulouse', '31000', 'Haute-Garonne', 'Occitanie'),
('Nice', '06000', 'Alpes-Maritimes', 'Provence-Alpes-Côte d''Azur'),
('Nantes', '44000', 'Loire-Atlantique', 'Pays de la Loire'),
('Strasbourg', '67000', 'Bas-Rhin', 'Grand Est'),
('Montpellier', '34000', 'Hérault', 'Occitanie'),
('Bordeaux', '33000', 'Gironde', 'Nouvelle-Aquitaine'),
('Lille', '59000', 'Nord', 'Hauts-de-France'),
('Rennes', '35000', 'Ille-et-Vilaine', 'Bretagne'),
('Reims', '51100', 'Marne', 'Grand Est'),
('Le Havre', '76600', 'Seine-Maritime', 'Normandie'),
('Saint-Étienne', '42000', 'Loire', 'Auvergne-Rhône-Alpes'),
('Toulon', '83000', 'Var', 'Provence-Alpes-Côte d''Azur'),
('Grenoble', '38000', 'Isère', 'Auvergne-Rhône-Alpes'),
('Dijon', '21000', 'Côte-d''Or', 'Bourgogne-Franche-Comté'),
('Angers', '49000', 'Maine-et-Loire', 'Pays de la Loire'),
('Nîmes', '30000', 'Gard', 'Occitanie'),
('Villeurbanne', '69100', 'Rhône', 'Auvergne-Rhône-Alpes'),
('Saint-Denis', '93200', 'Seine-Saint-Denis', 'Île-de-France'),
('Le Mans', '72000', 'Sarthe', 'Pays de la Loire'),
('Aix-en-Provence', '13100', 'Bouches-du-Rhône', 'Provence-Alpes-Côte d''Azur'),
('Clermont-Ferrand', '63000', 'Puy-de-Dôme', 'Auvergne-Rhône-Alpes'),
('Brest', '29200', 'Finistère', 'Bretagne'),
('Limoges', '87000', 'Haute-Vienne', 'Nouvelle-Aquitaine'),
('Tours', '37000', 'Indre-et-Loire', 'Centre-Val de Loire'),
('Amiens', '80000', 'Somme', 'Hauts-de-France'),
('Perpignan', '66000', 'Pyrénées-Orientales', 'Occitanie'),
('Metz', '57000', 'Moselle', 'Grand Est'),
('Besançon', '25000', 'Doubs', 'Bourgogne-Franche-Comté'),
('Boulogne-Billancourt', '92100', 'Hauts-de-Seine', 'Île-de-France'),
('Orléans', '45000', 'Loiret', 'Centre-Val de Loire'),
('Mulhouse', '68100', 'Haut-Rhin', 'Grand Est'),
('Caen', '14000', 'Calvados', 'Normandie'),
('Rouen', '76000', 'Seine-Maritime', 'Normandie'),
('Nancy', '54000', 'Meurthe-et-Moselle', 'Grand Est'),
('Argenteuil', '95100', 'Val-d''Oise', 'Île-de-France'),
('Montreuil', '93100', 'Seine-Saint-Denis', 'Île-de-France'),
('Saint-Paul', '97460', 'La Réunion', 'La Réunion'),
('Nanterre', '92000', 'Hauts-de-Seine', 'Île-de-France')
ON CONFLICT (name) DO NOTHING;
