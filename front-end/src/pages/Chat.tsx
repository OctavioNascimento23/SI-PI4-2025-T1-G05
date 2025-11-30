import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, MensagemChat } from '../lib/supabase';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Send, User, ArrowLeft, Video } from 'lucide-react';

export function Chat() {
  const { consultoriaId: paramId } = useParams<{ consultoriaId: string }>();
  const [searchParams] = useSearchParams();
  const consultoriaId = paramId || searchParams.get('consultoria') || undefined;
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [consultoria, setConsultoria] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consultoriaId) {
      loadConsultoria();
      loadMensagens();
      subscribeToMessages();
    }
  }, [consultoriaId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConsultoria = async () => {
    try {
      const { data, error } = await supabase
        .from('consultoria')
        .select(`
          *,
          comerciante:id_usuario_comerciante(id_usuario, nome, email, foto_perfil_url),
          consultor:id_usuario_consultor(id_usuario, nome, email, foto_perfil_url)
        `)
        .eq('id_consultoria', consultoriaId)
        .single();

      if (error) throw error;
      setConsultoria(data);
    } catch (error) {
      console.error('Erro ao carregar consultoria:', error);
    }
  };

  const loadMensagens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mensagem_chat')
        .select('*')
        .eq('id_consultoria', consultoriaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMensagens(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat-${consultoriaId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagem_chat',
          filter: `id_consultoria=eq.${consultoriaId}`,
        },
        (payload) => {
          setMensagens((current) => [...current, payload.new as MensagemChat]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !usuario || !consultoriaId) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('mensagem_chat')
        .insert({
          id_consultoria: consultoriaId,
          id_remetente: usuario.id_usuario,
          mensagem: novaMensagem.trim(),
        });

      if (error) throw error;

      setNovaMensagem('');
    } catch (error: any) {
      alert('Erro ao enviar mensagem: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const getOutroUsuario = () => {
    if (!consultoria || !usuario) return null;

    if (usuario.id_usuario === consultoria.id_usuario_comerciante) {
      return consultoria.consultor;
    } else {
      return consultoria.comerciante;
    }
  };

  const addLinkReuniao = async () => {
    const link = prompt('Cole o link da reunião (Google Meet, Zoom, etc):');
    if (link && consultoriaId) {
      try {
        const { error } = await supabase
          .from('consultoria')
          .update({ link_reuniao: link })
          .eq('id_consultoria', consultoriaId);

        if (error) throw error;
        setConsultoria({ ...consultoria, link_reuniao: link });
        alert('Link adicionado com sucesso!');
      } catch (error: any) {
        alert('Erro ao salvar link: ' + error.message);
      }
    }
  };

  const outroUsuario = getOutroUsuario();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(usuario?.tipo_usuario === 'Comerciante' ? '/dashboard-empresa' : '/dashboard-consultor')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="h-[calc(100vh-12rem)] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {outroUsuario?.foto_perfil_url ? (
                    <img
                      src={outroUsuario.foto_perfil_url}
                      alt={outroUsuario.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{outroUsuario?.nome || 'Usuário'}</h2>
                  <p className="text-sm text-gray-600">{outroUsuario?.email}</p>
                </div>
              </div>
              <div>
                {consultoria?.link_reuniao ? (
                  <a
                    href={consultoria.link_reuniao}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Entrar na Reunião
                    </Button>
                  </a>
                ) : (
                  usuario?.tipo_usuario === 'Consultor' && (
                    <Button variant="outline" size="sm" onClick={addLinkReuniao}>
                      <Video className="h-4 w-4 mr-2" />
                      Adicionar Reunião
                    </Button>
                  )
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {mensagens.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Nenhuma mensagem ainda.</p>
                <p className="text-sm mt-2">Envie a primeira mensagem para começar a conversa!</p>
              </div>
            ) : (
              mensagens.map((msg) => {
                const isOwn = msg.id_remetente === usuario?.id_usuario;
                return (
                  <div
                    key={msg.id_mensagem}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.mensagem}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <textarea
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                disabled={sending}
              />
              <Button
                onClick={enviarMensagem}
                disabled={sending || !novaMensagem.trim()}
                className="self-end"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Pressione Enter para enviar, Shift + Enter para quebrar linha
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
