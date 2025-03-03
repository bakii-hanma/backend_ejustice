const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/database');
const plainteRoutes = require('./routes/plainteRoutes');
const preuveRoutes = require('./routes/preuveRoutes');
const enqueteRoutes = require('./routes/enqueteRoutes');
const interrogatoireRoutes = require('./routes/interrogatoireRoutes');
const enqueteurSecondaireRoutes = require('./routes/enqueteurSecondaireRoutes');
const fileUpload = require('express-fileupload');
const transmissionParquetRoutes = require('./routes/transmissionParquetRoutes');
const parquetRoutes = require('./routes/parquetRoutes');
const adminRoutes = require('./routes/adminRoutes');
const decisionMagistratRoutes = require('./routes/decisionMagistratRoutes');
const magistratRoutes = require('./routes/magistratRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const convocationRoutes = require('./routes/convocationRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const celluleRoutes = require('./routes/celluleRoutes');
const peineRoutes = require('./routes/peineRoutes');
const detenuRoutes = require('./routes/detenuRoutes');
const adminPenitentiaireRoutes = require('./routes/adminPenitentiaireRoutes');
const statistiquesRoutes = require('./routes/statistiquesRoutes');

// Configuration CORS avancée
const corsOptions = {
    origin: [
        'http://127.0.0.1:8000',
        'https://emore-junior.alwaysdata.net',
        'https://emore-junior.alwaysdata.net/ejustice',
        'https://emore-junior.alwaysdata.net/ejustice/',
        // Garder les URLs de développement local pour le debug
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost:5000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware pour gérer les erreurs CORS préflight
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    debug: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    parseNested: true,
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true
}));

// Route racine avec page d'accueil
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Backend E-Justice</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                text-align: center;
            }
            .container {
                padding: 2rem;
                max-width: 800px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                color: #ffffff;
            }
            p {
                font-size: 1.2rem;
                line-height: 1.6;
                margin-bottom: 1.5rem;
                color: #e0e0e0;
            }
            .status {
                display: inline-block;
                padding: 0.5rem 1rem;
                background: #4CAF50;
                border-radius: 25px;
                font-weight: bold;
            }
            .version {
                margin-top: 2rem;
                font-size: 0.9rem;
                color: #a0a0a0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏛️ Backend E-Justice</h1>
            <p>Bienvenue sur l'API du système de justice électronique</p>
            <div class="status">Statut: Opérationnel</div>
            <p class="version">Version 1.0.0</p>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

// Fonction pour vérifier si une table existe
async function tableExists(tableName) {
    try {
        const [rows] = await db.execute(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = 'emore-junior_ejustice' 
            AND table_name = ?
        `, [tableName]);
        return rows[0].count > 0;
    } catch (error) {
        console.error(`Erreur lors de la vérification de la table ${tableName}:`, error);
        return false;
    }
}

// Fonction pour initialiser la base de données
async function initializeDatabase() {
    try {
        console.log('Vérification et création des tables si nécessaire...');

        // Liste des migrations dans l'ordre
        const migrations = [
            require('./migrations/001_create_utilisateurs_table'),
            require('./migrations/002_create_plaintes_table'),
            require('./migrations/003_create_documents_plainte_table'),
            require('./migrations/004_create_enquetes_table'),
            require('./migrations/005_create_interrogatoires_table'),
            require('./migrations/006_create_preuves_table'),
            require('./migrations/007_create_enqueteurs_secondaires_table'),
            require('./migrations/008_create_documents_preuve_table'),
            require('./migrations/009_create_transmissions_parquet_table'),
            require('./migrations/010_create_parquet_table'),
            require('./migrations/011_add_transferee_parquet_to_enquetes'),
            require('./migrations/012_add_magistrat_fields'),
            require('./migrations/013_create_decisions_magistrat_table'),
            require('./migrations/014_add_parquet_id_to_utilisateurs'),
            require('./migrations/015_add_collecte_fields_to_preuves'),
            require('./migrations/016_create_default_admin')
        ];

        // Exécuter chaque migration
        for (const migration of migrations) {
            try {
                await migration.up();
            } catch (error) {
                console.error('Erreur lors de la migration:', error);
                // Continuer avec la migration suivante même en cas d'erreur
            }
        }

        console.log('Initialisation de la base de données terminée');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
}

// Fonction utilitaire pour vérifier l'existence d'une colonne
async function checkColumnExists(tableName, columnName) {
    try {
        const [rows] = await db.execute(`
            SELECT COUNT(*) as count
            FROM information_schema.columns
            WHERE table_schema = 'e_justice'
            AND table_name = ?
            AND column_name = ?
        `, [tableName, columnName]);
        return rows[0].count > 0;
    } catch (error) {
        console.error('Erreur lors de la vérification de la colonne:', error);
        return false;
    }
}

// Ajouter cette fonction pour vérifier si l'admin existe
async function checkAdminExists() {
    try {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM utilisateurs WHERE role = "admin"'
        );
        return rows[0].count > 0;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'admin:', error);
        return false;
    }
}

// Ajouter cette fonction pour créer l'admin par défaut
async function createDefaultAdmin() {
    const bcrypt = require('bcrypt');
    const defaultAdmin = {
        nom: 'Admin',
        prenom: 'System',
        email: 'admin@ejustice.com',
        telephone: null,
        adresse: null,
        date_naissance: null,
        role: 'admin',
        mot_de_passe: await bcrypt.hash('admin123', 10),
        numero_citoyen: 'ADMIN001'
    };

    try {
        const [result] = await db.execute(`
            INSERT INTO utilisateurs 
            (nom, prenom, email, telephone, adresse, date_naissance, role, mot_de_passe, numero_citoyen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            defaultAdmin.nom,
            defaultAdmin.prenom,
            defaultAdmin.email,
            defaultAdmin.telephone,
            defaultAdmin.adresse,
            defaultAdmin.date_naissance,
            defaultAdmin.role,
            defaultAdmin.mot_de_passe,
            defaultAdmin.numero_citoyen
        ]);

        console.log('Compte admin par défaut créé avec succès');
        return result.insertId;
    } catch (error) {
        console.error('Erreur lors de la création du compte admin:', error);
        throw error;
    }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plaintes', plainteRoutes);
app.use('/api/preuves', preuveRoutes);
app.use('/api/enquetes', enqueteRoutes);
app.use('/api/interrogatoires', interrogatoireRoutes);
app.use('/api/enqueteurs-secondaires', enqueteurSecondaireRoutes);
app.use('/api/transmissions', transmissionParquetRoutes);
app.use('/api/parquets', parquetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/decisions', decisionMagistratRoutes);
app.use('/api/magistrat', magistratRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/convocations', convocationRoutes);
app.use('/api/audiences', audienceRoutes);
app.use('/api/cellules', celluleRoutes);
app.use('/api/peines', peineRoutes);
app.use('/api/detenus', detenuRoutes);
app.use('/api/admin-penitentiaire', adminPenitentiaireRoutes);
app.use('/api/statistiques', statistiquesRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Quelque chose s\'est mal passé!' });
});

// Fonction pour trouver un port disponible
async function findAvailablePort(startPort) {
    const net = require('net');
    
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        
        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
}

// Démarrage du serveur
async function startServer() {
    try {
        // Initialiser la base de données avant de démarrer le serveur
        await initializeDatabase();
        
        const preferredPort = process.env.PORT || 3000;
        const port = await findAvailablePort(preferredPort);
        
        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer(); 