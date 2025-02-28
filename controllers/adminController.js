const User = require('../models/User');
const bcrypt = require('bcrypt');

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            email,
            role,
            mot_de_passe,
            // Champs optionnels
            telephone,
            adresse,
            date_naissance,
            numero_citoyen,
            specialite,
            juridiction,
            fonction_magistrat,
            date_prise_fonction,
            id_parquet,
            is_active
        } = req.body;

        // Validation des champs obligatoires
        if (!nom || !prenom || !email || !role || !mot_de_passe) {
            return res.status(400).json({
                message: 'Les champs nom, prénom, email, rôle et mot de passe sont obligatoires',
                error: 'MISSING_REQUIRED_FIELDS'
            });
        }

        // Validation spécifique pour les magistrats
        if (role === 'magistrat' && !id_parquet) {
            return res.status(400).json({
                message: 'L\'ID du parquet est obligatoire pour un magistrat',
                error: 'MISSING_PARQUET_ID'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Créer l'utilisateur
        const userId = await User.createUser({
            nom,
            prenom,
            email,
            role,
            mot_de_passe: hashedPassword,
            telephone,
            adresse,
            date_naissance,
            numero_citoyen,
            specialite,
            juridiction,
            fonction_magistrat,
            date_prise_fonction,
            id_parquet,
            is_active
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            userId
        });

    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        
        if (error.message === 'ID_PARQUET_REQUIRED') {
            return res.status(400).json({
                message: 'L\'ID du parquet est obligatoire pour un magistrat',
                error: 'MISSING_PARQUET_ID'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la création de l\'utilisateur',
            error: 'SERVER_ERROR'
        });
    }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    try {
        const { id_utilisateur } = req.params;
        const updateData = req.body;

        const updatedUser = await User.updateUser(id_utilisateur, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé ou aucune modification effectuée',
                error: 'USER_NOT_FOUND'
            });
        }

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'utilisateur',
            error: 'SERVER_ERROR'
        });
    }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
    try {
        const { id_utilisateur } = req.params;
        const { nouveau_mot_de_passe } = req.body;

        if (!nouveau_mot_de_passe) {
            return res.status(400).json({
                message: 'Le nouveau mot de passe est requis',
                error: 'MISSING_NEW_PASSWORD'
            });
        }

        const success = await User.resetPassword(id_utilisateur, nouveau_mot_de_passe);

        if (!success) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé',
                error: 'USER_NOT_FOUND'
            });
        }

        res.json({
            message: 'Mot de passe réinitialisé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        res.status(500).json({
            message: 'Erreur lors de la réinitialisation du mot de passe',
            error: 'SERVER_ERROR'
        });
    }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
    try {
        const { id_utilisateur } = req.params;
        const success = await User.deleteUser(id_utilisateur);

        if (!success) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé',
                error: 'USER_NOT_FOUND'
            });
        }

        res.json({
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l\'utilisateur',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json({
            message: 'Liste des utilisateurs récupérée avec succès',
            users
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
    createUser,
    updateUser,
    resetPassword,
    deleteUser,
    getAllUsers
}; 