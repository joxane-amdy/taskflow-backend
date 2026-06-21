# TaskFlow Backend — API REST NestJS

API REST du projet TaskFlow (gestion de tâches), réalisée dans le cadre de l'examen
final du module API REST — Licence 2 GI.

Backend : NestJS + TypeORM + MySQL + JWT + RBAC.
Frontend : React (dépôt séparé), consommé via cette API.

## Équipe

| Rôle | Membre | Module principal |
|---|---|---|
| Chef de groupe | amdy diokhane | Authentification (JWT, RBAC) | = auth/
| Membre 2 | mamadou bassirou Ba | Tâches (CRUD + stats) | = tasks/
| Membre 3 | Babacar Sarr| Catégories + API externe (Weather) | = categories + Weather/
| Membre 4 | Arame Diop | les utilisateurs | = users/

## Stack technique

- **NestJS** — framework backend
- **TypeORM + MySQL** — base de données relationnelle
- **JWT (passport-jwt)** — authentification par token
- **RBAC** — autorisation par rôles via `@Roles()` + `RolesGuard`
- **class-validator** — validation des DTO
- **OpenWeather API** — API externe (météo du dashboard)

## Démarrage

```bash
git clone https://github.com/<organisation>/taskflow-backend.git
cd taskflow-backend
git checkout develop

npm install
cp .env
# éditer .env avec tes paramètres MySQL locaux

mysql -u root -p -e "CREATE DATABASE \`taskflow-db\`;"

npm run start:dev
```

L'API tourne sur **http://localhost:3000**

## Structure complète du projet

```
taskflow-backend/
├── .env             # Modèle de variables d'environnement
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── README.md
│
└── src/
    ├── main.ts                        # Bootstrap, CORS, ValidationPipe
    ├── app.module.ts                  # Module racine — connexion TypeORM
    │
    ├── auth/                          # Authentification & autorisation
    │   ├── auth.module.ts
    │   ├── auth.service.ts            # register, login, génération JWT
    │   ├── auth.controller.ts         # POST /auth/register, /auth/login
    │   ├── jwt.strategy.ts            # Stratégie passport-jwt
    │   ├── login.dto.ts
    │   ├── roles.decorator.ts         # @Roles('admin')
    │   └── roles.guard.ts             # RBAC — vérifie le rôle de l'utilisateur
    │
    ├── users/                         # Utilisateurs
    │   ├── user.entity.ts             # id, prenom, nom, email, password, role
    │   ├── users.module.ts
    │   ├── users.service.ts
    │   ├── users.controller.ts        # GET /users, GET /users/me
    │   └── dto/
    │       └── create-user.dto.ts
    │
    ├── tasks/                         # Tâches (cœur de l'app)
    │   ├── task.entity.ts             # id, titre, type, priorite, terminee...
    │   ├── tasks.module.ts
    │   ├── tasks.service.ts           # CRUD + stats dashboard
    │   ├── tasks.controller.ts        # GET/POST/PATCH/DELETE /tasks
    │   └── dto/
    │       ├── create-task.dto.ts
    │       └── update-task.dto.ts
    │
    ├── categories/                    # Catégories de tâches
    │   ├── category.entity.ts         # id, nom, couleur, description
    │   ├── categories.module.ts
    │   ├── categories.service.ts
    │   ├── categories.controller.ts   # GET/POST/DELETE /categories
    │   └── dto/
    │       └── create-category.dto.ts
    │
    └── weather/                       # API externe (OpenWeather)
        ├── weather.module.ts
        ├── weather.service.ts
        └── weather.controller.ts      # GET /weather?city=Dakar
```

## Endpoints de l'API

### Auth (publics)
| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/register` | Créer un compte (prenom, nom, email, password) |
| POST | `/auth/login` | Connexion (email, password) → `access_token` |

### Users (JWT requis)
| Méthode | Route | Description |
|---|---|---|
| GET | `/users` | Liste des utilisateurs |
| GET | `/users/me` | Profil de l'utilisateur connecté |

### Tasks (JWT requis)
| Méthode | Route | Description |
|---|---|---|
| GET | `/tasks` | Mes tâches |
| GET | `/tasks/stats` | Stats dashboard (total, terminées, en cours) |
| GET | `/tasks/:id` | Détail d'une tâche |
| POST | `/tasks` | Créer — { titre, type, priorite?, terminee?, categoryId? } |
| PATCH | `/tasks/:id` | Modifier |
| DELETE | `/tasks/:id` | Supprimer |

### Categories (JWT requis)
| Méthode | Route | Description |
|---|---|---|
| GET | `/categories` | Liste |
| GET | `/categories/:id` | Détail |
| POST | `/categories` | Créer — { nom, couleur?, description? } |
| DELETE | `/categories/:id` | Supprimer |

### Weather (JWT requis)
| Méthode | Route | Description |
|---|---|---|
| GET | `/weather?city=Dakar` | Météo pour le dashboard |

## RBAC — protéger une route aux admins

```ts
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

---

## Git Flow — organisation du dépôt

Deux branches permanentes, une branche `feature/*` par membre.

```
main        ──●──────────────────────────────●──────────►   version stable (soutenance)
               \                              ▲
                \                            (merge final)
develop      ────●────●────●────●────●────●───────────►   intégration de l'équipe
                  \    \    \    \
                   \    \    \    └─ feature/users
                    \    \    └────── feature/categories
                     \    └─────────── feature/tasks
                      └────────────────── feature/auth
```

### Branches permanentes

| Branche | Rôle |
|---|---|
| `main` | Version stable, présentée en soutenance. Jamais de commit direct. |
| `develop` | Intégration de toutes les fonctionnalités. Base de toutes les branches `feature/*`. |

### Branches de fonctionnalité (une par membre)

| Branche | Responsable | Contenu |
|---|---|---|
| `feature/auth` | Chef de groupe | JWT, register/login, `RolesGuard`, `@Roles()` |
| `feature/tasks` | Membre 2 | Entité `Task`, CRUD, endpoint `/tasks/stats` |
| `feature/categories` | Membre 3 | Entité `Category`, CRUD, module `weather` (API externe) |
| `feature/frontend` | Membre 4 | Connexion du frontend React à l'API (remplacement des appels `localStorage`) |

### Règles de protection (à configurer par le chef de groupe)

Sur GitHub : **Settings → Branches → Add rule**, appliquer à `main` et `develop` :
- ✅ Require a pull request before merging
- ✅ Require at least 1 approval
- ✅ Aucun push direct autorisé

### Workflow quotidien (pour chaque membre)

```bash
# 1. Se mettre à jour depuis develop
git checkout develop
git pull origin develop

# 2. Créer sa branche de fonctionnalité
git checkout -b feature/tasks

# 3. Travailler, committer régulièrement
git add .
git commit -m "feat: ajout du CRUD pour les tâches"

# 4. Pousser et ouvrir une Pull Request
git push origin feature/tasks
# Sur GitHub : Pull Request feature/tasks → develop
```

### Convention de commits

```
feat: ajout authentification JWT
fix: correction validation DTO Task
docs: mise à jour du README
refactor: simplification de TasksService
test: ajout tests unitaires sur TasksService
```

### Cycle de fusion vers `main`

1. Chaque `feature/*` est mergée dans `develop` via Pull Request, après revue du chef de groupe.
2. Une fois toutes les fonctionnalités validées et testées sur `develop`, le chef de groupe ouvre une Pull Request `develop → main`.
3. `main` ne reçoit que des versions stables, prêtes pour la soutenance.
## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
