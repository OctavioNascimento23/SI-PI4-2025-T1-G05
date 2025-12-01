import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ExperienciaConsultor, ProjetoConsultor, AvaliacaoConsultor } from '../lib/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader } from '../components/Card';
import { StarRating } from '../components/StarRating';
import { PhotoUpload } from '../components/PhotoUpload';
import { Briefcase, Plus, Trash2, Save, X, Linkedin, User, Mail, Phone, Award, Building, Star, Globe, Github, Instagram, ExternalLink } from 'lucide-react';

export function PerfilConsultor() {
  const { usuario } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [experiencias, setExperiencias] = useState<ExperienciaConsultor[]>([]);
  const [projetos, setProjetos] = useState<ProjetoConsultor[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoConsultor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingExperience, setAddingExperience] = useState(false);
  const [addingProject, setAddingProject] = useState(false);

  const [profileData, setProfileData] = useState({
    foto_perfil_url: '',
    bio: '',
    linkedin_url: '',
    portfolio_url: '',
    github_url: '',
    instagram_url: '',
    website_url: '',
    telefone: '',
  });

  const [newExperience, setNewExperience] = useState({
    cargo: '',
    empresa: '',
    data_inicio: '',
    data_fim: '',
    descricao: '',
  });

  const [newProject, setNewProject] = useState({
    nome_projeto: '',
    empresa: '',
    link_url: '',
    descricao: '',
    data_conclusao: '',
  });

  useEffect(() => {
    loadData();
  }, [usuario]);

  const loadData = async () => {
    if (!usuario) return;

    try {
      setLoading(true);

      const { data: freshUserData } = await supabase
        .from('usuario')
        .select('*')
        .eq('id_usuario', usuario.id_usuario)
        .maybeSingle();

      const currentUser = freshUserData || usuario;
      setCurrentUserData(currentUser);

      setProfileData({
        foto_perfil_url: currentUser.foto_perfil_url || '',
        bio: currentUser.bio || '',
        linkedin_url: currentUser.linkedin_url || '',
        portfolio_url: currentUser.portfolio_url || '',
        github_url: currentUser.github_url || '',
        instagram_url: currentUser.instagram_url || '',
        website_url: currentUser.website_url || '',
        telefone: currentUser.telefone || '',
      });

      const { data: expData } = await supabase
        .from('experiencia_consultor')
        .select('*')
        .eq('id_usuario', usuario.id_usuario)
        .order('data_inicio', { ascending: false });

      const { data: projData } = await supabase
        .from('projeto_consultor')
        .select('*')
        .eq('id_usuario', usuario.id_usuario)
        .order('data_conclusao', { ascending: false });

      const { data: avalData } = await supabase
        .from('avaliacao_consultor')
        .select('*, avaliador:id_avaliador(nome)')
        .eq('id_consultor', usuario.id_usuario)
        .order('created_at', { ascending: false });

      setExperiencias(expData || []);
      setProjetos(projData || []);
      setAvaliacoes(avalData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!usuario) return;

    try {
      const { error } = await supabase
        .from('usuario')
        .update(profileData)
        .eq('id_usuario', usuario.id_usuario);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
      setEditingProfile(false);

      await loadData();
    } catch (error: any) {
      alert('Erro ao atualizar perfil: ' + error.message);
    }
  };

  const handlePhotoUploaded = async (url: string) => {
    if (!usuario) return;

    try {
      const { error } = await supabase
        .from('usuario')
        .update({ foto_perfil_url: url })
        .eq('id_usuario', usuario.id_usuario);

      if (error) throw error;

      setProfileData({ ...profileData, foto_perfil_url: url });
      await loadData();
    } catch (error: any) {
      alert('Erro ao atualizar foto: ' + error.message);
    }
  };

  const addExperience = async () => {
    if (!usuario) return;

    try {
      const { error } = await supabase
        .from('experiencia_consultor')
        .insert({
          id_usuario: usuario.id_usuario,
          ...newExperience,
          data_fim: newExperience.data_fim || null,
        });

      if (error) throw error;

      setNewExperience({ cargo: '', empresa: '', data_inicio: '', data_fim: '', descricao: '' });
      setAddingExperience(false);
      loadData();
    } catch (error: any) {
      alert('Erro ao adicionar experiência: ' + error.message);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm('Deseja remover esta experiência?')) return;

    try {
      const { error } = await supabase
        .from('experiencia_consultor')
        .delete()
        .eq('id_experiencia', id);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      alert('Erro ao remover experiência: ' + error.message);
    }
  };

  const addProject = async () => {
    if (!usuario) return;

    try {
      const { error } = await supabase
        .from('projeto_consultor')
        .insert({
          id_usuario: usuario.id_usuario,
          ...newProject,
          data_conclusao: newProject.data_conclusao || null,
        });

      if (error) throw error;

      setNewProject({ nome_projeto: '', empresa: '', link_url: '', descricao: '', data_conclusao: '' });
      setAddingProject(false);
      loadData();
    } catch (error: any) {
      alert('Erro ao adicionar projeto: ' + error.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Deseja remover este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projeto_consultor')
        .delete()
        .eq('id_projeto', id);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      alert('Erro ao remover projeto: ' + error.message);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'Atual';
    return new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {editingProfile && usuario ? (
                  <PhotoUpload
                    currentPhotoUrl={profileData.foto_perfil_url}
                    userId={usuario.id_usuario}
                    onPhotoUploaded={handlePhotoUploaded}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                    {profileData.foto_perfil_url ? (
                      <img src={profileData.foto_perfil_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                )}
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-gray-900">{(currentUserData || usuario)?.nome}</h2>
                  <p className="text-sm text-gray-500 mt-1">Consultor Profissional</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <StarRating rating={(currentUserData || usuario)?.nota_media || 0} showNumber={true} />
                    <span className="text-xs text-gray-500">
                      ({(currentUserData || usuario)?.total_avaliacoes || 0} avaliações)
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{(currentUserData || usuario)?.email}</span>
                  </div>
                  {profileData.telefone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span>{profileData.telefone}</span>
                    </div>
                  )}
                  {profileData.linkedin_url && (
                    <a
                      href={profileData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profileData.portfolio_url && (
                    <a
                      href={profileData.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Portfólio</span>
                    </a>
                  )}
                  {profileData.github_url && (
                    <a
                      href={profileData.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profileData.instagram_url && (
                    <a
                      href={profileData.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-pink-600 hover:text-pink-800 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {profileData.website_url && (
                    <a
                      href={profileData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>

                <div className="w-full pt-4">
                  <Button onClick={() => setEditingProfile(true)} className="w-full" size="sm">
                    Editar Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Sobre Mim
                </h3>
              </CardHeader>
              <CardContent>
                {profileData.bio ? (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profileData.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">Adicione uma descrição sobre você...</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Experiências</p>
                      <p className="text-3xl font-bold text-blue-600">{experiencias.length}</p>
                    </div>
                    <Briefcase className="w-10 h-10 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Projetos</p>
                      <p className="text-3xl font-bold text-green-600">{projetos.length}</p>
                    </div>
                    <Building className="w-10 h-10 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {editingProfile && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <h3 className="text-xl font-bold text-blue-600">Editar Perfil</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="URL da Foto de Perfil"
                value={profileData.foto_perfil_url}
                onChange={(e) => setProfileData({ ...profileData, foto_perfil_url: e.target.value })}
                placeholder="https://exemplo.com/foto.jpg"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="Conte sobre sua experiência, especializações e o que te motiva..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="LinkedIn"
                  value={profileData.linkedin_url}
                  onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
                <Input
                  label="Portfólio"
                  value={profileData.portfolio_url}
                  onChange={(e) => setProfileData({ ...profileData, portfolio_url: e.target.value })}
                  placeholder="https://seu-portfolio.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="GitHub"
                  value={profileData.github_url}
                  onChange={(e) => setProfileData({ ...profileData, github_url: e.target.value })}
                  placeholder="https://github.com/seu-usuario"
                />
                <Input
                  label="Instagram"
                  value={profileData.instagram_url}
                  onChange={(e) => setProfileData({ ...profileData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/seu-usuario"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Website Pessoal"
                  value={profileData.website_url}
                  onChange={(e) => setProfileData({ ...profileData, website_url: e.target.value })}
                  placeholder="https://seu-site.com"
                />
                <Input
                  label="Telefone"
                  value={profileData.telefone}
                  onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={updateProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button onClick={() => setEditingProfile(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Experiência Profissional</h2>
              </div>
              {!addingExperience && (
                <Button onClick={() => setAddingExperience(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {addingExperience && (
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
                  <h4 className="font-semibold text-blue-900">Nova Experiência</h4>
                  <Input
                    label="Cargo"
                    value={newExperience.cargo}
                    onChange={(e) => setNewExperience({ ...newExperience, cargo: e.target.value })}
                    placeholder="Ex: Consultor de Marketing Digital"
                  />
                  <Input
                    label="Empresa"
                    value={newExperience.empresa}
                    onChange={(e) => setNewExperience({ ...newExperience, empresa: e.target.value })}
                    placeholder="Ex: Acme Consulting"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Data Início"
                      type="date"
                      value={newExperience.data_inicio}
                      onChange={(e) => setNewExperience({ ...newExperience, data_inicio: e.target.value })}
                    />
                    <Input
                      label="Data Fim (deixe vazio se atual)"
                      type="date"
                      value={newExperience.data_fim}
                      onChange={(e) => setNewExperience({ ...newExperience, data_fim: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      value={newExperience.descricao}
                      onChange={(e) => setNewExperience({ ...newExperience, descricao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Descreva suas principais responsabilidades, conquistas e habilidades desenvolvidas..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addExperience} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button onClick={() => setAddingExperience(false)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {experiencias.length === 0 && !addingExperience && (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma experiência cadastrada</p>
                  <p className="text-sm mt-1">Adicione suas experiências profissionais para se destacar!</p>
                </div>
              )}

              {experiencias.map((exp) => (
                <div key={exp.id_experiencia} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{exp.cargo}</h3>
                      <p className="text-blue-600 font-medium">{exp.empresa}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.data_inicio)} - {formatDate(exp.data_fim || '')}
                      </p>
                      {exp.descricao && (
                        <p className="mt-3 text-gray-700 whitespace-pre-wrap leading-relaxed">{exp.descricao}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => deleteExperience(exp.id_experiencia)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">Projetos e Cases de Sucesso</h2>
              </div>
              {!addingProject && (
                <Button onClick={() => setAddingProject(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {addingProject && (
                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50 space-y-3">
                  <h4 className="font-semibold text-green-900">Novo Projeto</h4>
                  <Input
                    label="Nome do Projeto"
                    value={newProject.nome_projeto}
                    onChange={(e) => setNewProject({ ...newProject, nome_projeto: e.target.value })}
                    placeholder="Ex: Transformação Digital Completa"
                  />
                  <Input
                    label="Empresa/Cliente"
                    value={newProject.empresa}
                    onChange={(e) => setNewProject({ ...newProject, empresa: e.target.value })}
                    placeholder="Ex: Padaria São João"
                  />
                  <Input
                    label="Link (site, portfólio, estudo de caso)"
                    value={newProject.link_url}
                    onChange={(e) => setNewProject({ ...newProject, link_url: e.target.value })}
                    placeholder="https://..."
                  />
                  <Input
                    label="Data de Conclusão"
                    type="date"
                    value={newProject.data_conclusao}
                    onChange={(e) => setNewProject({ ...newProject, data_conclusao: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Projeto</label>
                    <textarea
                      value={newProject.descricao}
                      onChange={(e) => setNewProject({ ...newProject, descricao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                      placeholder="Descreva o desafio, sua solução e os resultados alcançados..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addProject} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button onClick={() => setAddingProject(false)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {projetos.length === 0 && !addingProject && (
                <div className="text-center py-12 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum projeto cadastrado</p>
                  <p className="text-sm mt-1">Mostre os projetos em que trabalhou e os resultados obtidos!</p>
                </div>
              )}

              {projetos.map((proj) => (
                <div key={proj.id_projeto} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{proj.nome_projeto}</h3>
                          <p className="text-green-600 font-medium">{proj.empresa}</p>
                          {proj.data_conclusao && (
                            <p className="text-sm text-gray-500 mt-1">
                              Concluído em {formatDate(proj.data_conclusao)}
                            </p>
                          )}
                        </div>
                      </div>
                      {proj.descricao && (
                        <p className="mt-3 text-gray-700 whitespace-pre-wrap leading-relaxed">{proj.descricao}</p>
                      )}
                      {proj.link_url && (
                        <a
                          href={proj.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-3"
                        >
                          Ver projeto completo →
                        </a>
                      )}
                    </div>
                    <Button
                      onClick={() => deleteProject(proj.id_projeto)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Avaliações dos Clientes</h2>
            </div>
          </CardHeader>
          <CardContent>
            {avaliacoes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhuma avaliação ainda</p>
                <p className="text-sm mt-1">Quando você atender clientes, eles poderão avaliar seu trabalho aqui!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.map((aval: any) => (
                  <div key={aval.id_avaliacao} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{aval.avaliador?.nome}</p>
                        <StarRating rating={aval.nota} showNumber={false} size={16} />
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(aval.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {aval.comentario && (
                      <p className="text-gray-700 leading-relaxed">{aval.comentario}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
