-- Données d'exemple pour le développement

-- Utilisateurs d'exemple
INSERT INTO users (email, password_hash, first_name, last_name, phone, location, bio) VALUES
('ahmed@example.com', '$2b$10$example_hash_1', 'Ahmed', 'Dudaev', '+33612345678', 'Paris 18e', 'Membre actif de la communauté. Toujours prêt à aider!'),
('fatima@example.com', '$2b$10$example_hash_2', 'Fatima', 'Musaeva', '+33623456789', 'Lyon 7e', 'Passionnée de cuisine et artisanat.'),
('malik@example.com', '$2b$10$example_hash_3', 'Malik', 'Saidov', '+33634567890', 'Marseille 13e', 'Entrepreneur, toujours à la recherche de bonnes affaires.')
ON CONFLICT (email) DO NOTHING;

-- Annonces d'exemple
INSERT INTO listings (user_id, category_id, title, description, price, price_negotiable, condition, location, status) VALUES
(1, 2, 'Renault Clio 2018 - Excellent état', 'Vends Renault Clio en très bon état, première main, révisions à jour. Idéale pour famille. Prix négociable entre nous.', 12500.00, true, 'bon_etat', 'Paris 18e', 'active'),
(2, 10, 'Plats traditionnels faits maison', 'Propose préparation de plats traditionnels pour vos événements familiaux. Spécialités tchétchènes authentiques.', 25.00, true, 'neuf', 'Lyon 7e', 'active'),
(3, 3, 'Recherche chauffeur VTC', 'Restaurant cherche chauffeur VTC fiable pour livraisons. Bonne connaissance de la communauté souhaitée.', 0, false, NULL, 'Marseille', 'active'),
(1, 5, 'iPhone 13 Pro - Comme neuf', 'iPhone 13 Pro 256Go, acheté il y a 8 mois, avec tous les accessoires d''origine.', 750.00, true, 'comme_neuf', 'Paris 18e', 'active'),
(2, 11, 'Organisation mariage traditionnel', 'Services complets pour organisation de mariages traditionnels. Décoration, traiteur, coordination.', 0, true, NULL, 'Lyon', 'active')
ON CONFLICT DO NOTHING;

-- Images d'annonces d'exemple
INSERT INTO listing_images (listing_id, image_url, display_order) VALUES
(1, '/placeholder.svg?height=400&width=600', 0),
(2, '/placeholder.svg?height=400&width=600', 0),
(4, '/placeholder.svg?height=400&width=600', 0),
(5, '/placeholder.svg?height=400&width=600', 0)
ON CONFLICT DO NOTHING;
