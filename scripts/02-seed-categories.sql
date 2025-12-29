-- Insertion des catégories principales adaptées à la communauté

INSERT INTO categories (name, slug, icon, description) VALUES
('Immobilier', 'immobilier', 'Home', 'Vente et location de biens immobiliers'),
('Véhicules', 'vehicules', 'Car', 'Voitures, motos, et autres véhicules'),
('Emploi', 'emploi', 'Briefcase', 'Offres d''emploi et services professionnels'),
('Services', 'services', 'Wrench', 'Services à la personne et professionnels'),
('Électronique', 'electronique', 'Smartphone', 'Téléphones, ordinateurs, et électronique'),
('Maison & Jardin', 'maison-jardin', 'Sofa', 'Meubles, décoration, et équipement'),
('Mode', 'mode', 'Shirt', 'Vêtements, chaussures, et accessoires'),
('Loisirs', 'loisirs', 'Gamepad2', 'Sports, jeux, et hobbies'),
('Famille', 'famille', 'Baby', 'Articles pour enfants et bébés'),
('Alimentation', 'alimentation', 'UtensilsCrossed', 'Produits alimentaires et cuisine'),
('Événements', 'evenements', 'Calendar', 'Mariages, fêtes, et cérémonies'),
('Éducation', 'education', 'GraduationCap', 'Cours, formations, et tutorat'),
('Communauté', 'communaute', 'Users', 'Entraide et partage communautaire'),
('Autres', 'autres', 'Package', 'Divers articles et services')
ON CONFLICT (slug) DO NOTHING;
