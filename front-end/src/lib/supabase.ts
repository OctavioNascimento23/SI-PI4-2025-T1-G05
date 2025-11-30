import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TipoUsuario = 'Comerciante' | 'Consultor';
export type TipoNegocio =
  | 'Bar'
  | 'Padaria'
  | 'Mercadinho'
  | 'Restaurante'
  | 'Lanchonete'
  | 'Cafeteria'
  | 'Loja de Roupas'
  | 'Farmácia'
  | 'Pet Shop'
  | 'Salão de Beleza'
  | 'Academia'
  | 'Livraria'
  | 'Papelaria'
  | 'Eletrônicos'
  | 'Mercado'
  | 'Outro';
export type StatusRoadmap = 'Em andamento' | 'Concluído';
export type VersaoAcesso = 'Gratuito' | 'Premium';

export interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
  telefone?: string;
  foto_perfil_url?: string;
  bio?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  instagram_url?: string;
  website_url?: string;
  especialidades?: string[];
  nota_media?: number;
  total_avaliacoes?: number;
  created_at: string;
}

export interface Negocio {
  id_negocio: string;
  id_usuario: string;
  nome_negocio: string;
  tipo_negocio: TipoNegocio;
  descricao_inicial?: string;
  created_at: string;
}

export interface Diagnostico {
  id_diagnostico: string;
  id_negocio: string;
  data_diagnostico: string;
  respostas_json?: any;
  pontuacao_digital?: number;
  created_at: string;
}

export interface Roadmap {
  id_roadmap: string;
  id_diagnostico: string;
  data_geracao: string;
  etapas_detalhadas?: string;
  status: StatusRoadmap;
  created_at: string;
}

export interface Consultoria {
  id_consultoria: string;
  id_usuario_comerciante: string;
  id_usuario_consultor?: string;
  descricao?: string;
  data_hora_agendamento?: string;
  link_reuniao?: string;
  historico_chat?: string;
  observacoes_suporte?: string;
  status: string;
  created_at: string;
}

export interface ConteudoEducativo {
  id_conteudo: string;
  titulo: string;
  categoria?: string;
  url_acesso?: string;
  versao_acesso: VersaoAcesso;
  created_at: string;
}

export interface ExperienciaConsultor {
  id_experiencia: string;
  id_usuario: string;
  cargo: string;
  empresa: string;
  data_inicio: string;
  data_fim?: string;
  descricao?: string;
  created_at: string;
}

export interface ProjetoConsultor {
  id_projeto: string;
  id_usuario: string;
  nome_projeto: string;
  empresa: string;
  link_url?: string;
  descricao?: string;
  data_conclusao?: string;
  created_at: string;
}

export interface MensagemChat {
  id_mensagem: string;
  id_consultoria: string;
  id_remetente: string;
  mensagem: string;
  created_at: string;
}

export interface AvaliacaoConsultor {
  id_avaliacao: string;
  id_consultor: string;
  id_avaliador: string;
  nota: number;
  comentario?: string;
  created_at: string;
}
