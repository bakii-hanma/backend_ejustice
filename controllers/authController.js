const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        // 1. Validation des champs requis
        if (!email || !mot_de_passe) {
            return res.status(400).json({ 
                message: 'Email et mot de passe sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        // 2. Vérification de l'email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                message: 'Aucun compte trouvé avec cet email',
                error: 'EMAIL_NOT_FOUND'
            });
        }

        // 3. Vérification du mot de passe
        const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!validPassword) {
            return res.status(401).json({ 
                message: 'Mot de passe incorrect',
                error: 'INVALID_PASSWORD'
            });
        }

        // 4. Création du token JWT
        const token = jwt.sign(
            { 
                userId: user.id_utilisateur,
                role: user.role
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        // 5. Préparation des données utilisateur à renvoyer
        const userData = {
            id: user.id_utilisateur,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role
        };

        // Ajouter les champs spécifiques aux magistrats
        if (user.role === 'magistrat') {
            userData.id_parquet = user.id_parquet;
            userData.juridiction = user.juridiction;
            userData.fonction_magistrat = user.fonction_magistrat;
            userData.statut_magistrat = user.statut_magistrat;
            userData.is_active = user.statut_magistrat === 'Actif';
        }

        res.json({
            message: 'Connexion réussie',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            message: 'Erreur lors de la connexion',
            error: 'SERVER_ERROR'
        });
    }
};

const generateCitizenNumber = () => {
    // Génère un numéro de 6 chiffres aléatoires
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    return `CIT${randomNumbers}`;
};

const register = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            email, 
            telephone, 
            adresse, 
            date_naissance, 
            mot_de_passe 
        } = req.body;

        // 1. Validation des champs requis
        if (!nom || !prenom || !email || !mot_de_passe) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis',
                error: 'MISSING_REQUIRED_FIELDS'
            });
        }

        // 2. Vérification si l'email existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé',
                error: 'EMAIL_ALREADY_EXISTS'
            });
        }

        // 3. Validation du format de la date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (date_naissance && !dateRegex.test(date_naissance)) {
            return res.status(400).json({
                message: 'Format de date invalide. Utilisez YYYY-MM-DD',
                error: 'INVALID_DATE_FORMAT'
            });
        }

        // 4. Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Format d\'email invalide',
                error: 'INVALID_EMAIL_FORMAT'
            });
        }

        // 5. Génération du numéro de citoyen unique
        let numero_citoyen;
        let isUnique = false;
        while (!isUnique) {
            numero_citoyen = generateCitizenNumber();
            const existingNumber = await User.findByCitizenNumber(numero_citoyen);
            if (!existingNumber) {
                isUnique = true;
            }
        }

        // 6. Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        
        // 7. Création de l'utilisateur
        const userData = {
            nom: nom.trim(),
            prenom: prenom.trim(),
            email: email.trim(),
            telephone: telephone ? telephone.trim() : null,
            adresse: adresse ? adresse.trim() : null,
            date_naissance: date_naissance || null,
            role: 'citoyen',
            mot_de_passe: hashedPassword,
            numero_citoyen: numero_citoyen
        };

        const userId = await User.create(userData);

        // 8. Génération du token JWT pour connexion automatique
        const token = jwt.sign(
            { 
                userId: userId,
                role: 'citoyen' 
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        // 9. Envoi de la réponse
        res.status(201).json({
            message: 'Compte citoyen créé avec succès',
            userId: userId,
            numero_citoyen: numero_citoyen,
            token: token
        });

    } catch (error) {
        console.error('Erreur lors de la création du compte:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création du compte',
            error: 'SERVER_ERROR'
        });
    }
};

const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                message: 'Le rôle est requis',
                error: 'MISSING_ROLE'
            });
        }

        const users = await User.findByRole(role); // Méthode à créer dans le modèle User

        res.json({
            message: 'Utilisateurs récupérés avec succès',
            users: users
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    login,
    register,
    getUsersByRole
}; 