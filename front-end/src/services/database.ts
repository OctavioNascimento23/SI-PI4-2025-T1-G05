import { supabase, Negocio, Diagnostico, Roadmap, Consultoria, ConteudoEducativo, Usuario } from '../lib/supabase';

export const negocioService = {
  async getAll() {
    const { data, error } = await supabase
      .from('negocio')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Negocio[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('negocio')
      .select('*')
      .eq('id_negocio', id)
      .maybeSingle();

    if (error) throw error;
    return data as Negocio | null;
  },

  async create(negocio: Omit<Negocio, 'id_negocio' | 'created_at'>) {
    const { data, error } = await supabase
      .from('negocio')
      .insert(negocio)
      .select()
      .single();

    if (error) throw error;
    return data as Negocio;
  },

  async update(id: string, negocio: Partial<Negocio>) {
    const { data, error } = await supabase
      .from('negocio')
      .update(negocio)
      .eq('id_negocio', id)
      .select()
      .single();

    if (error) throw error;
    return data as Negocio;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('negocio')
      .delete()
      .eq('id_negocio', id);

    if (error) throw error;
  },
};

export const diagnosticoService = {
  async getByNegocio(negocioId: string) {
    const { data, error } = await supabase
      .from('diagnostico')
      .select('*')
      .eq('id_negocio', negocioId)
      .order('data_diagnostico', { ascending: false });

    if (error) throw error;
    return data as Diagnostico[];
  },

  async create(diagnostico: Omit<Diagnostico, 'id_diagnostico' | 'created_at' | 'data_diagnostico'>) {
    const { data, error } = await supabase
      .from('diagnostico')
      .insert(diagnostico)
      .select()
      .single();

    if (error) throw error;
    return data as Diagnostico;
  },
};

export const roadmapService = {
  async getByDiagnostico(diagnosticoId: string) {
    const { data, error } = await supabase
      .from('roadmap')
      .select('*')
      .eq('id_diagnostico', diagnosticoId)
      .maybeSingle();

    if (error) throw error;
    return data as Roadmap | null;
  },

  async create(roadmap: Omit<Roadmap, 'id_roadmap' | 'created_at' | 'data_geracao'>) {
    const { data, error } = await supabase
      .from('roadmap')
      .insert(roadmap)
      .select()
      .single();

    if (error) throw error;
    return data as Roadmap;
  },

  async updateStatus(id: string, status: 'Em andamento' | 'Concluído') {
    const { data, error } = await supabase
      .from('roadmap')
      .update({ status })
      .eq('id_roadmap', id)
      .select()
      .single();

    if (error) throw error;
    return data as Roadmap;
  },
};

export const consultoriaService = {
  async getAll() {
    const { data, error } = await supabase
      .from('consultoria')
      .select(`
        *,
        comerciante:usuario!consultoria_id_usuario_comerciante_fkey(nome, email),
        consultor:usuario!consultoria_id_usuario_consultor_fkey(nome, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(consultoria: Omit<Consultoria, 'id_consultoria' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('consultoria')
      .insert(consultoria)
      .select()
      .single();

    if (error) throw error;
    return data as Consultoria;
  },

  async update(id: string, consultoria: Partial<Consultoria>) {
    const { data, error } = await supabase
      .from('consultoria')
      .update(consultoria)
      .eq('id_consultoria', id)
      .select()
      .single();

    if (error) throw error;
    return data as Consultoria;
  },
};

export const conteudoEducativoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('conteudo_educativo')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ConteudoEducativo[];
  },

  async trackAccess(userId: string, conteudoId: string) {
    const { error } = await supabase
      .from('acompanhamento_conteudo')
      .insert({ id_usuario: userId, id_conteudo: conteudoId });

    if (error && !error.message.includes('duplicate')) throw error;
  },
};

export const usuarioService = {
  async getConsultores() {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('tipo_usuario', 'Consultor');

    if (error) throw error;
    return data as Usuario[];
  },

  async update(id: string, usuario: Partial<Usuario>) {
    const { data, error } = await supabase
      .from('usuario')
      .update(usuario)
      .eq('id_usuario', id)
      .select()
      .single();

    if (error) throw error;
    return data as Usuario;
  },
};
