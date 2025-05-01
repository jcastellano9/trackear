
-- Creación de la tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Creación de la tabla de inversiones
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  tipo TEXT CHECK (tipo IN ('cripto', 'cedear')),
  activo TEXT NOT NULL,
  cantidad NUMERIC NOT NULL,
  precio_compra NUMERIC NOT NULL,
  moneda TEXT NOT NULL,
  fecha_compra TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Configuración de RLS (Row Level Security) para la tabla de perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Configuración de RLS para la tabla de inversiones
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver solo sus inversiones"
  ON investments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias inversiones"
  ON investments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias inversiones"
  ON investments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias inversiones"
  ON investments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Función para crear automáticamente un perfil cuando un usuario se registra
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || (NEW.raw_user_meta_data->>'full_name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activar el trigger después de insertar un nuevo usuario
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_new_user();

-- Índice para mejorar la velocidad de consultas
CREATE INDEX IF NOT EXISTS investments_user_id_idx ON investments (user_id);
CREATE INDEX IF NOT EXISTS investments_tipo_idx ON investments (tipo);
