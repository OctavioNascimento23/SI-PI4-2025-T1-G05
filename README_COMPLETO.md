# Sistema de Consultoria - Documentação Completa

## 📋 Visão Geral

Sistema web de plataforma de consultoria que conecta clientes com consultores. A plataforma permite que clientes criem solicitações de projetos, mantenham comunicação em tempo real via chat e acompanhem o progresso dos trabalhos. Consultores podem aceitar projetos e colaborar com clientes através da plataforma.

**Versão:** 0.0.1-SNAPSHOT
**Status:** Em Desenvolvimento

---

## 🏗️ Arquitetura do Projeto

### Stack Tecnológico

#### Backend
- **Framework:** Spring Boot 2.7.18
- **Linguagem:** Java 8
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (JSON Web Token)
- **Comunicação em Tempo Real:** WebSocket
- **Build Tool:** Maven
- **Gerador de PDF:** iText 7
- **ORM:** Hibernate / JPA

#### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.17
- **Roteamento:** React Router 7.9.6
- **HTTP Client:** Axios 1.13.2
- **Linting:** ESLint 9.39.1

### Estrutura de Pastas

```
projeto/
├── backend/                          # Aplicação Spring Boot
│   ├── src/main/
│   │   ├── java/com/consultoria/app/
│   │   │   ├── ConsultoriaApplication.java    # Classe principal
│   │   │   ├── config/                         # Configurações
│   │   │   │   ├── SecurityConfig.java         # Segurança Spring
│   │   │   │   └── WebSocketConfig.java        # WebSocket
│   │   │   ├── controller/                     # REST Controllers
│   │   │   │   ├── AuthController.java         # Autenticação
│   │   │   │   ├── ChatController.java         # Chat WebSocket
│   │   │   │   ├── ChatRestController.java     # Chat REST
│   │   │   │   ├── ConsultantController.java   # Consultores
│   │   │   │   ├── ProjectController.java      # Projetos
│   │   │   │   ├── RequestController.java      # Solicitações
│   │   │   │   ├── RoadmapController.java      # Roadmaps
│   │   │   │   └── StatusHistoryController.java # Histórico
│   │   │   ├── dto/                            # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── ProjectDTO.java
│   │   │   │   └── ...
│   │   │   ├── model/                          # Entidades JPA
│   │   │   ├── repository/                     # Data Access Layer
│   │   │   ├── security/                       # Segurança (JWT, etc)
│   │   │   ├── service/                        # Lógica de Negócio
│   │   │   ├── tcp/                            # Servidor TCP customizado
│   │   │   │   └── handler/                    # Handlers TCP
│   │   │   └── util/                           # Utilitários
│   │   └── resources/
│   │       └── application.properties          # Configurações
│   ├── pom.xml                                 # Dependências Maven
│   └── data/roadmaps/                          # Dados de roadmaps
│
├── frontend/                         # Aplicação React
│   ├── src/
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.jsx                   # Componente raiz
│   │   ├── components/               # Componentes reutilizáveis
│   │   │   ├── Navbar.jsx            # Barra de navegação
│   │   │   ├── ProtectedRoute.jsx    # Rotas protegidas
│   │   │   ├── ImageUpload.jsx       # Upload de imagens
│   │   │   ├── StarRating.jsx        # Classificação
│   │   │   └── modals/               # Modais
│   │   │       ├── EditUserProfileModal.jsx
│   │   │       └── RoadmapModal.jsx
│   │   ├── pages/                    # Páginas da aplicação
│   │   │   ├── LandingPage.jsx       # Página inicial
│   │   │   ├── LoginPage.jsx         # Login
│   │   │   ├── RegisterPage.jsx      # Registro
│   │   │   ├── UserDashboard.jsx     # Dashboard do usuário
│   │   │   ├── ConsultantDashboard.jsx
│   │   │   ├── ConsultantProfile.jsx
│   │   │   ├── ChatPage.jsx          # Página de chat
│   │   │   ├── RequestPage.jsx       # Solicitações
│   │   │   └── ConsultantProfile.jsx
│   │   ├── services/                 # Serviços HTTP e lógica
│   │   │   ├── api.js                # Configuração Axios
│   │   │   ├── authService.js        # Autenticação
│   │   │   ├── chatService.js        # Chat
│   │   │   ├── projectService.js     # Projetos
│   │   │   ├── tcpClient.js          # Cliente TCP
│   │   │   └── TCPService.js         # Serviço TCP
│   │   ├── assets/                   # Imagens e arquivos estáticos
│   │   ├── App.css
│   │   └── index.css
│   ├── public/                       # Arquivos públicos
│   ├── vite.config.js                # Config Vite
│   ├── tailwind.config.js            # Config Tailwind
│   ├── package.json                  # Dependências npm
│   └── eslint.config.js              # Config ESLint
│
└── data/                             # Dados compartilhados
    └── roadmaps/                     # Roadmaps de projetos
```

---

## 🚀 Inicialização do Projeto

### Pré-requisitos

- **Java 8+** instalado
- **Node.js 18+** e **npm 9+** instalado
- **PostgreSQL 12+** instalado e rodando
- **Maven 3.6+** instalado

### Configuração do Banco de Dados

1. **Criar banco de dados PostgreSQL:**
```sql
CREATE DATABASE consultoria;
```

2. **Configurar credenciais** no arquivo `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/consultoria
spring.datasource.username=postgres
spring.datasource.password=sua_senha
```

### Executar Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

### Executar Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### Ambos os servidores juntos

Em dois terminais separados:

**Terminal 1 - Backend:**
```bash
cd backend && mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

---

## 🔐 Autenticação

### JWT (JSON Web Token)

O sistema utiliza JWT para autenticação:

- **Secret Key:** Configurável em `application.properties`
- **Tempo de Expiração:** 24 horas (86400000 ms)
- **Algoritmo:** HS256

### Endpoints de Autenticação

#### Registrar
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Seu Nome Completo",
  "email": "seu_email@exemplo.com",
  "password": "sua_senha_segura",
  "role": "CLIENT"  // ou "CONSULTANT"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "seu_email@exemplo.com",
  "password": "sua_senha_segura"
}
```

**Response:**
```json
{
  "token": "hash para encriptografar",
  "user": {
    "id": 1,
    "name": "Seu Nome Completo",
    "email": "seu_email@exemplo.com",
    "role": "CLIENT"
  }
}
```

---

## 📡 API REST Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout

### Projetos
- `GET /api/projects` - Listar todos os projetos do usuário
- `POST /api/projects` - Criar novo projeto
- `GET /api/projects/{id}` - Obter detalhes do projeto
- `PUT /api/projects/{id}` - Atualizar projeto
- `DELETE /api/projects/{id}` - Deletar projeto

### Chat
- `GET /api/chat/messages/{projectId}` - Obter mensagens de um projeto
- `POST /api/chat/messages` - Enviar mensagem
- `GET /api/chat/messages/{projectId}/{messageId}` - Obter mensagem específica

### Consultores
- `GET /api/consultants` - Listar consultores
- `GET /api/consultants/{id}` - Obter perfil do consultor
- `PUT /api/consultants/{id}` - Atualizar perfil

### Solicitações
- `GET /api/requests` - Listar solicitações
- `POST /api/requests` - Criar solicitação
- `PUT /api/requests/{id}/status` - Atualizar status

### Roadmaps
- `POST /api/roadmap/create?projectId={id}&userId={id}` - Criar novo roadmap
- `GET /api/roadmap/{roadmapId}` - Obter detalhes do roadmap
- `GET /api/roadmap/project/{projectId}` - Listar roadmaps de um projeto
- `GET /api/roadmap/user/{userId}` - Listar roadmaps criados por um usuário
- `PUT /api/roadmap/{roadmapId}` - Atualizar roadmap
- `DELETE /api/roadmap/{roadmapId}` - Deletar roadmap
- `POST /api/roadmap/send?roadmapId={id}&userId={id}` - Enviar roadmap para cliente
- `GET /api/roadmap/download/{roadmapId}` - Baixar PDF do roadmap
- `POST /api/roadmap/generate` - Gerar PDF sem salvar (apenas retorna bytes)

### Histórico de Status
- `GET /api/status-history/{projectId}` - Obter histórico de status
- `POST /api/status-history` - Registrar mudança de status

---

## 💬 WebSocket (Chat em Tempo Real)

### Configuração
- **Endpoint:** `/ws/chat`
- **Protocolo:** STOMP

### Fluxo de Comunicação

1. **Conectar:**
```javascript
const socket = new SockJS('/ws/chat');
const stompClient = Stomp.over(socket);
stompClient.connect({}, frame => {
  // Conectado
});
```

2. **Inscrever em tópico:**
```javascript
stompClient.subscribe(`/topic/chat/${projectId}`, message => {
  console.log('Mensagem recebida:', message.body);
});
```

3. **Enviar mensagem:**
```javascript
stompClient.send(`/app/chat/send`, {}, JSON.stringify({
  projectId: 1,
  senderId: 1,
  content: "Olá, consultoria!"
}));
```

---

## 🔧 TCP Server Customizado

### Propósito
Servidor TCP para comunicação de baixo nível com clientes externos.

### Configuração
- **Porta:** 8888 (configurável em `application.properties`)
- **Host:** localhost

### Uso
```java
// Conectar ao servidor TCP
Socket socket = new Socket("localhost", 8888);
OutputStream out = socket.getOutputStream();

// Enviar comando
String command = "CHAT|GET_MESSAGES|projectId=1";
out.write(command.getBytes());
```

---

## 👥 Modelos de Dados Principais

### User (Usuário)
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role; // CLIENT, CONSULTANT, ADMIN
    private String profilePhotoUrl;
    private String bio;
    private String company;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Project (Projeto)
```java
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Cliente
    
    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private User consultant; // Consultor atribuído
    
    private String name;
    private String description;
    @Enumerated(EnumType.STRING)
    private Status status; // PENDING, IN_PROGRESS, COMPLETED
    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH
    private Integer progress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### ChatMessage (Mensagem de Chat)
```java
@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    
    private String content;
    private LocalDateTime timestamp;
}
```

### StatusHistory (Histórico de Status)
```java
@Entity
@Table(name = "status_history")
public class StatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @Enumerated(EnumType.STRING)
    private Status oldStatus;
    @Enumerated(EnumType.STRING)
    private Status newStatus;
    
    private String reason;
    private LocalDateTime changedAt;
}
```

### Roadmap (Roadmap do Projeto)
```java
@Entity
@Table(name = "roadmaps")
public class Roadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy; // Consultor que criou
    
    private String title;
    private String description;
    
    @Column(columnDefinition = "LONGBLOB")
    private byte[] pdfContent; // PDF armazenado no banco
    
    private String pdfFilename;
    
    @Column(columnDefinition = "TEXT")
    private String stepsJson; // Etapas em formato JSON
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

## 🎨 Interface do Usuário

### Páginas Principais

#### Landing Page
- Página inicial da aplicação
- Apresentação da plataforma
- Links para login/registro

#### Página de Registro
- Formulário de criação de conta
- Seleção de tipo (Cliente ou Consultor)
- Validações de email e senha

#### Página de Login
- Autenticação com email e senha
- Lembrar credenciais (opcional)
- Link para recuperação de senha

#### Dashboard do Cliente
- Visão geral de todos os projetos
- Estatísticas (total, pendente, em progresso, concluído)
- Criar nova solicitação
- Visualizar detalhes do projeto

#### Dashboard do Consultor
- Projetos atribuídos
- Projetos disponíveis
- Histórico de projetos concluídos
- Perfil e avaliações

#### Página de Chat
- Conversa em tempo real com consultor
- Histórico de mensagens
- Envio de arquivos (opcional)
- Notificações de novas mensagens

#### Perfil do Consultor
- Informações profissionais
- Experiência e especialidades
- Avaliações e recomendações
- Portfólio de projetos

---

## 🧪 Testes

### Backend

```bash
# Executar todos os testes
mvn test

# Executar testes com cobertura
mvn test jacoco:report

# Executar teste específico
mvn test -Dtest=UserServiceTest
```

### Frontend

```bash
# Executar linting
npm run lint

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 📋 Principais Funcionalidades

### ✅ Cliente
- [x] Criar conta e fazer login
- [x] Criar solicitações de consultoria
- [x] Atribuir consultores a projetos
- [x] Acompanhar progresso em tempo real
- [x] Comunicação via chat
- [x] Visualizar histórico de projetos
- [x] Avaliar consultores
- [x] Download de relatórios (PDF)

### ✅ Consultor
- [x] Criar conta com perfil profissional
- [x] Visualizar projetos disponíveis
- [x] Aceitar/recusar projetos
- [x] Atualizar status do projeto
- [x] Comunicação via chat
- [x] Gerar relatórios
- [x] Visualizar avaliações dos clientes
- [x] Gerenciar disponibilidade

### ✅ Admin
- [x] Gerenciar usuários
- [x] Monitorar projetos
- [x] Gerar relatórios gerenciais
- [x] Configurar parâmetros do sistema

---

## ⚙️ Configurações Importantes

### Backend (`application.properties`)

```properties
# Servidor TCP
tcp.server.port=8888
session.timeout=3600

# Servidor Web
server.port=8080

# Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/consultoria
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=mySecretKeyForJWTTokenGenerationThatIsLongEnoughForHS256Algorithm
jwt.expiration=86400000

# Upload de Arquivos
file.upload.dir=./uploads
```

### Frontend (`.env`)

Criar arquivo `.env` na raiz do frontend:

```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

---

## 🐛 Troubleshooting

### Backend não conecta ao banco de dados
**Solução:**
1. Verificar se PostgreSQL está rodando
2. Verificar credenciais em `application.properties`
3. Verificar se banco de dados `consultoria` foi criado
4. Limpar cache: `mvn clean`

### Frontend não conecta ao backend
**Solução:**
1. Verificar se backend está rodando em `http://localhost:8080`
2. Verificar CORS em `SecurityConfig.java`
3. Verificar URL da API em `services/api.js`
4. Limpar cache do navegador (F12 → Ctrl+Shift+Del)

### Erro de porta já em uso
**Solução:**
```powershell
# Backend
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Frontend
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### WebSocket não conecta
**Solução:**
1. Verificar se `WebSocketConfig.java` está configurado corretamente
2. Verificar se o endpoint `/ws/chat` é acessível
3. Limpar cache do navegador
4. Reiniciar o backend

---

## 📚 Documentação Adicional

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io)

---

## 👥 Contribuintes

- Grupo 05 - SI-PI4-2025-T1

---

## 📝 Licença

Este projeto é desenvolvido para fins educacionais.

---

## 🗂️ Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 0.0.1-SNAPSHOT | Dez 2025 | Versão inicial |

---

## ✉️ Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Última atualização:** 5 de dezembro de 2025
