-- ============================================
-- ENARM PRO - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS PROFILE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    specialty TEXT,
    exam_date DATE,
    subscription_tier TEXT CHECK (subscription_tier IN ('free', 'pro', 'elite')) DEFAULT 'free',
    subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'expired')) DEFAULT 'active',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SIMULADORES
-- ============================================
CREATE TABLE public.simuladores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tipo TEXT CHECK (tipo IN ('completo', 'rapido', 'especialidad')) DEFAULT 'completo',
    especialidad TEXT,
    total_preguntas INTEGER NOT NULL,
    preguntas_correctas INTEGER DEFAULT 0,
    preguntas_incorrectas INTEGER DEFAULT 0,
    preguntas_sin_contestar INTEGER DEFAULT 0,
    porcentaje DECIMAL(5,2),
    tiempo_total INTEGER, -- en segundos
    estado TEXT CHECK (estado IN ('en_progreso', 'finalizado', 'abandonado')) DEFAULT 'en_progreso',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RESPUESTAS DE SIMULADOR
-- ============================================
CREATE TABLE public.simulador_respuestas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    simulador_id UUID REFERENCES public.simuladores(id) ON DELETE CASCADE NOT NULL,
    pregunta_id INTEGER NOT NULL,
    opcion_seleccionada INTEGER,
    es_correcta BOOLEAN,
    tiempo_respuesta INTEGER, -- en segundos
    marcada_para_revision BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FLASHCARDS PROGRESS
-- ============================================
CREATE TABLE public.flashcard_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    flashcard_id TEXT NOT NULL,
    veces_vista INTEGER DEFAULT 0,
    ultima_vez_vista TIMESTAMP WITH TIME ZONE,
    dificultad TEXT CHECK (dificultad IN ('facil', 'media', 'dificil')) DEFAULT 'media',
    proxima_revision TIMESTAMP WITH TIME ZONE,
    intervalo_dias INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, flashcard_id)
);

-- ============================================
-- ESTUDIO DE GPC
-- ============================================
CREATE TABLE public.gpc_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    gpc_code TEXT NOT NULL,
    estado TEXT CHECK (estado IN ('no_iniciada', 'en_progreso', 'completada')) DEFAULT 'no_iniciada',
    progreso_porcentaje INTEGER DEFAULT 0,
    tiempo_estudiado INTEGER DEFAULT 0, -- en minutos
    notas TEXT,
    marcada_prioridad BOOLEAN DEFAULT FALSE,
    ultima_vez_estudiada TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gpc_code)
);

-- ============================================
-- PLAN DE ESTUDIO
-- ============================================
CREATE TABLE public.study_plan (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    especialidad TEXT NOT NULL,
    objetivo TEXT,
    dias_por_semana INTEGER DEFAULT 5,
    horas_por_dia DECIMAL(3,1) DEFAULT 3.0,
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_objetivo DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SESIONES DE ESTUDIO
-- ============================================
CREATE TABLE public.study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tipo TEXT CHECK (tipo IN ('simulador', 'flashcards', 'gpc', 'otros')) NOT NULL,
    duracion INTEGER NOT NULL, -- en minutos
    preguntas_respondidas INTEGER DEFAULT 0,
    flashcards_revisadas INTEGER DEFAULT 0,
    notas TEXT,
    session_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ESTADÍSTICAS AGREGADAS
-- ============================================
CREATE TABLE public.user_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_simuladores INTEGER DEFAULT 0,
    total_preguntas_resueltas INTEGER DEFAULT 0,
    promedio_aciertos DECIMAL(5,2) DEFAULT 0,
    mejor_especialidad TEXT,
    peor_especialidad TEXT,
    racha_dias INTEGER DEFAULT 0,
    ultima_actividad TIMESTAMP WITH TIME ZONE,
    tiempo_total_estudio INTEGER DEFAULT 0, -- en minutos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LOGROS/ACHIEVEMENTS
-- ============================================
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PAGOS / SUSCRIPCIONES
-- ============================================
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'MXN',
    plan TEXT CHECK (plan IN ('pro', 'elite')) NOT NULL,
    billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_simuladores_user_id ON public.simuladores(user_id);
CREATE INDEX idx_simuladores_estado ON public.simuladores(estado);
CREATE INDEX idx_simulador_respuestas_simulador_id ON public.simulador_respuestas(simulador_id);
CREATE INDEX idx_flashcard_progress_user_id ON public.flashcard_progress(user_id);
CREATE INDEX idx_flashcard_progress_proxima_revision ON public.flashcard_progress(proxima_revision);
CREATE INDEX idx_gpc_progress_user_id ON public.gpc_progress(user_id);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON public.study_sessions(session_date);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Simuladores
ALTER TABLE public.simuladores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simuladores" 
    ON public.simuladores FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simuladores" 
    ON public.simuladores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simuladores" 
    ON public.simuladores FOR UPDATE 
    USING (auth.uid() = user_id);

-- Simulador Respuestas
ALTER TABLE public.simulador_respuestas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own respuestas" 
    ON public.simulador_respuestas FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.simuladores 
            WHERE simuladores.id = simulador_respuestas.simulador_id 
            AND simuladores.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own respuestas" 
    ON public.simulador_respuestas FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.simuladores 
            WHERE simuladores.id = simulador_respuestas.simulador_id 
            AND simuladores.user_id = auth.uid()
        )
    );

-- Flashcard Progress
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own flashcard progress" 
    ON public.flashcard_progress FOR ALL 
    USING (auth.uid() = user_id);

-- GPC Progress
ALTER TABLE public.gpc_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own GPC progress" 
    ON public.gpc_progress FOR ALL 
    USING (auth.uid() = user_id);

-- Study Plan
ALTER TABLE public.study_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own study plan" 
    ON public.study_plan FOR ALL 
    USING (auth.uid() = user_id);

-- Study Sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own study sessions" 
    ON public.study_sessions FOR ALL 
    USING (auth.uid() = user_id);

-- User Stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats" 
    ON public.user_stats FOR SELECT 
    USING (auth.uid() = user_id);

-- Achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" 
    ON public.achievements FOR SELECT 
    USING (auth.uid() = user_id);

-- Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" 
    ON public.payments FOR SELECT 
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcard_progress_updated_at BEFORE UPDATE ON public.flashcard_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gpc_progress_updated_at BEFORE UPDATE ON public.gpc_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plan_updated_at BEFORE UPDATE ON public.study_plan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar estadísticas después de simulador
CREATE OR REPLACE FUNCTION public.update_user_stats_after_simulador()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'finalizado' AND OLD.estado != 'finalizado' THEN
        UPDATE public.user_stats
        SET 
            total_simuladores = total_simuladores + 1,
            total_preguntas_resueltas = total_preguntas_resueltas + NEW.total_preguntas,
            promedio_aciertos = (
                SELECT AVG(porcentaje) 
                FROM public.simuladores 
                WHERE user_id = NEW.user_id AND estado = 'finalizado'
            ),
            ultima_actividad = NOW(),
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_after_simulador
    AFTER UPDATE ON public.simuladores
    FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_after_simulador();
