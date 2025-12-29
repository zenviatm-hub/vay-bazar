-- Table des avis (reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false, -- Avis vérifié (transaction confirmée)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reviewer_id, reviewed_user_id, listing_id) -- Un seul avis par transaction
);

-- Table des badges
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL, -- 'verified', 'trusted', 'top_seller', 'helpful', 'active'
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_type)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);

-- Activer RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour reviews
-- Permettre la lecture publique de tous les avis
CREATE POLICY "Allow public read access to reviews" ON reviews
  FOR SELECT
  USING (true);

-- Note: Les politiques INSERT et UPDATE seront gérées côté application via le service role
-- car nous utilisons un système d'authentification personnalisé

-- Politiques RLS pour badges
-- Permettre la lecture publique de tous les badges
CREATE POLICY "Allow public read access to badges" ON badges
  FOR SELECT
  USING (true);

-- Les badges sont créés automatiquement par le système (via service role)

