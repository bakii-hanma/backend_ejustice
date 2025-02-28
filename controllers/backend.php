<?php 

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;


function Liste_etablisements($role = 1) {
    global $pdo;
    
    // Obtention de l'année actuelle
    $currentYear = date('Y');

    // Requête SQL pour sélectionner les utilisateurs et les types de documents quittance et curricula
    $query = "
        SELECT 
            u.*, 
            COALESCE(q.url_document, '') AS quittance,
            COALESCE(c.url_document, '') AS curricula
        FROM 
            utilisateurs u
        LEFT JOIN 
            documents q ON u.id = q.etablissement_id 
            AND q.type_document = 'quittance' 
            AND YEAR(q.date_televersement) = :currentYear
        LEFT JOIN 
            documents c ON u.id = c.etablissement_id 
            AND c.type_document = 'curricula' 
            AND YEAR(c.date_televersement) = :currentYear
        WHERE 
            u.role = :role
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':role', $role, PDO::PARAM_INT);
    $stmt->bindParam(':currentYear', $currentYear, PDO::PARAM_INT);
    $stmt->execute();
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!$result) {
        return ['msg' => 'Aucun utilisateur trouvé pour ce rôle'];
    }
    
    return $result;
}

function CompterElevesParEtablissement($role = 1) {
    global $pdo;

    // Requête SQL pour compter le nombre d'élèves pour chaque établissement
    $query = "
        SELECT 
            u.id AS etablissement_id,
            u.nom_etablissement AS etablissement_nom,
            u.role,
            u.logo_etablissement,
            u.email,
            COUNT(c.id) AS nombre_elevs
        FROM 
            utilisateurs u
        LEFT JOIN 
            cadres_academiques c ON u.id = c.utilisateur_id
        WHERE 
            u.role = :role
        GROUP BY 
            u.id, u.nom_etablissement
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':role', $role, PDO::PARAM_INT);
    $stmt->execute();
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!$result) {
        return ['msg' => 'Aucun élève trouvé pour cet établissement'];
    }
    
    return $result;
}

function ListeResultats($etablissement_id) {
    global $pdo;

    $query = "
        SELECT
            c.filiere,
            COUNT(r.eleve_id) AS total_eleves,
            SUM(CASE WHEN r.notes >= 10 THEN 1 ELSE 0 END) AS nombre_admis,
            SUM(CASE WHEN r.notes < 10 THEN 1 ELSE 0 END) AS nombre_ajourne,
            ROUND(
                SUM(CASE WHEN r.notes >= 10 THEN 1 ELSE 0 END) * 100.0 / COUNT(r.eleve_id), 
                2
            ) AS pourcentage_admis,
            ROUND(
                SUM(CASE WHEN r.notes < 10 THEN 1 ELSE 0 END) * 100.0 / COUNT(r.eleve_id), 
                2
            ) AS pourcentage_ajourne
        FROM
            cadres_academiques c
        JOIN
            resultat_academique r ON c.id = r.eleve_id
        WHERE
            c.utilisateur_id = :etablissement_id
        GROUP BY
            c.filiere
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':etablissement_id', $etablissement_id, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
}

function ListeResultatsParFiliere($etablissement_id) {
    global $pdo;

    $query = "
        SELECT
            c.filiere,
            SUM(CASE WHEN r.notes >= 10 THEN 1 ELSE 0 END) AS nombre_admis,
            SUM(CASE WHEN r.notes < 10 THEN 1 ELSE 0 END) AS nombre_ajourne
        FROM
            cadres_academiques c
        JOIN
            resultat_academique r ON c.id = r.eleve_id
        WHERE
            c.utilisateur_id = :etablissement_id
        GROUP BY
            c.filiere
        ORDER BY
            c.filiere ASC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':etablissement_id', $etablissement_id, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
}

function RecupererUnEtablissement($utilisateur_id) {
    global $pdo;

    try {
        // Requête pour récupérer les informations de l'établissement
        $query = "SELECT * FROM utilisateurs WHERE id = :utilisateur_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':utilisateur_id', $utilisateur_id);
        $stmt->execute();
        $etablissement = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$etablissement) {
            return json_encode(['error' => 'Établissement non trouvé']);
        }

        // Récupérer les fondateurs associés à cet établissement
        $queryFondateurs = "SELECT * FROM fondateurs WHERE etablissement_id = :etablissement_id";
        $stmtFondateurs = $pdo->prepare($queryFondateurs);
        $stmtFondateurs->bindParam(':etablissement_id', $etablissement['id']);
        $stmtFondateurs->execute();
        $fondateurs = $stmtFondateurs->fetchAll(PDO::FETCH_ASSOC);

        // Récupérer les décrets associés à cet établissement
        $queryDecrets = "SELECT * FROM decret_etablissement WHERE etablissement_id = :etablissement_id";
        $stmtDecrets = $pdo->prepare($queryDecrets);
        $stmtDecrets->bindParam(':etablissement_id', $etablissement['id']);
        $stmtDecrets->execute();
        $decrets = $stmtDecrets->fetchAll(PDO::FETCH_ASSOC);

        // Structurer les données sans index numérique
        $result = [
            $etablissement,
            'fondateurs' => $fondateurs,
            'decrets' => $decrets
        ];

        // Retourner les données sous format JSON sans index numérique
        return json_encode($result);

    } catch (Exception $e) {
        return json_encode(['error' => 'Erreur lors de la récupération des données: ' . $e->getMessage()]);
    }
}

function generateRandomPassword($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $password;
}

function envoyerEmail($to, $motDePasse) {
    $message = "
        <html>
        <head>
            <title>Bienvenue sur notre plateforme</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 0 auto;
                }
                .email-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .email-content p {
                    line-height: 1.6;
                    color: #333;
                }
                .email-content a {
                    color: #0066cc;
                    text-decoration: none;
                    font-weight: bold;
                }
                .email-footer {
                    text-align: center;
                    margin-top: 30px;
                    color: #777;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <div class='email-header'>
                    <img src='https://medics.alwaysdata.net/dges/backends/photo_etablissement/66bba925ddf7f-ico_dges-removebg-preview.png' alt='Logo' style='max-width: 100px;'>
                </div>
                <div class='email-content'>
                    <p>Bonjour,</p>
                    <p>Nous vous avons créé un compte sur notre plateforme. Voici vos informations de connexion :</p>
                    <p><strong>Mot de passe :</strong> $motDePasse</p>
                    <p>Pour vous connecter, veuillez utiliser le lien suivant :</p>
                    <p><a href='http://medics.alwaysdata.net/dges/'>Se connecter</a></p>
                    <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                    <p>Merci,</p>
                    <p>L'équipe</p>
                </div>
                <div class='email-footer'>
                    <p>&copy; 2024 Notre Plateforme. Tous droits réservés.</p>
                </div>
            </div>
        </body>
        </html>
    ";

    // Envoi de l'e-mail de confirmation
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp-medics.alwaysdata.net';
        $mail->SMTPAuth = true;
        $mail->Username = 'medics@alwaysdata.net';
        $mail->Password = 'florentfranck';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        
        $mail->setFrom('medics@alwaysdata.net', 'DGES - Administrateur');
        $mail->addAddress($to);
        
        $mail->isHTML(true);
        $mail->Subject = 'Bienvenue sur notre plateforme';
        $mail->Body = $message;
        
        $mail->send();
        echo 'E-mail envoyé avec succès !';
    } catch (Exception $e) {
        echo 'Erreur lors de l\'envoi de l\'e-mail : ', $mail->ErrorInfo;
    }
}
function AjouterEtablissement($data) {
    global $pdo;

    // Générer un mot de passe aléatoire de 6 caractères
    $motDePasse = generateRandomPassword();
    
    // Ajouter un attribut 'role' avec la valeur 1
    $role = 1;

    try {
        // Démarrer une transaction
        $pdo->beginTransaction();

        // Insérer les informations de l'établissement dans la table `utilisateurs`
        $stmt = $pdo->prepare('INSERT INTO utilisateurs (
            nom_etablissement, annee_creation, annee_ouverture, nom_responsable, telephone_responsable, 
            email_responsable, fonction_responsable, statut, telephone, email, province, ville, quartier, 
            logo_etablissement, site_web_etablissement, mot_de_passe, role, frais_dts_bts, frais_licence, 
            frais_master, frais_doctorat, autre_frais
        ) VALUES (
            :nom_etablissement, :annee_creation, :annee_ouverture, :nom_responsable, :telephone_responsable, 
            :email_responsable, :fonction_responsable, :statut, :telephone, :email, :province, :ville, :quartier, 
            :logo_etablissement, :site_web_etablissement, :mot_de_passe, :role, :frais_dts_bts, :frais_licence, 
            :frais_master, :frais_doctorat, :autre_frais
        )');
        
        // Utilisation de l'opérateur '??' pour définir une valeur par défaut si le champ est absent
        $stmt->bindValue(':nom_etablissement', $data['nom_etablissement'] ?? '');
        $stmt->bindValue(':annee_creation', $data['annee_creation'] ?? '');
        $stmt->bindValue(':annee_ouverture', $data['annee_ouverture'] ?? '');
        $stmt->bindValue(':nom_responsable', $data['nom_responsable'] ?? '');
        $stmt->bindValue(':telephone_responsable', $data['telephone_responsable'] ?? '');
        $stmt->bindValue(':email_responsable', $data['email_responsable'] ?? '');
        $stmt->bindValue(':fonction_responsable', $data['fonction_responsable'] ?? '');
        $stmt->bindValue(':statut', $data['statut'] ?? '');
        $stmt->bindValue(':telephone', $data['telephone'] ?? '');
        $stmt->bindValue(':email', $data['email'] ?? '');
        $stmt->bindValue(':province', $data['province'] ?? '');
        $stmt->bindValue(':ville', $data['ville'] ?? '');
        $stmt->bindValue(':quartier', $data['quartier'] ?? '');
        $stmt->bindValue(':logo_etablissement', $data['logo_etablissement'] ?? '');
        $stmt->bindValue(':site_web_etablissement', $data['site_web_etablissement'] ?? '');
        $stmt->bindValue(':mot_de_passe', $motDePasse);
        $stmt->bindValue(':role', $role);
        $stmt->bindValue(':frais_dts_bts', $data['frais_dts_bts'] ?? 0);
        $stmt->bindValue(':frais_licence', $data['frais_licence'] ?? 0);
        $stmt->bindValue(':frais_master', $data['frais_master'] ?? 0);
        $stmt->bindValue(':frais_doctorat', $data['frais_doctorat'] ?? 0);
        $stmt->bindValue(':autre_frais', $data['autre_frais'] ?? 0);
        $stmt->execute();

        // Récupérer l'ID de l'établissement inséré
        $etablissementId = $pdo->lastInsertId();

        // Insérer les fondateurs dans la table `fondateurs`
        $stmtFondateur = $pdo->prepare('INSERT INTO fondateurs (etablissement_id, nom_fondateur, telephone, email) 
                                        VALUES (:etablissement_id, :nom_fondateur, :telephone, :email)');
        foreach ($data['fondateurs'] as $fondateur) {
            $stmtFondateur->bindValue(':etablissement_id', $etablissementId);
            $stmtFondateur->bindValue(':nom_fondateur', $fondateur['nom_fondateur'] ?? '');
            $stmtFondateur->bindValue(':telephone', $fondateur['telephone'] ?? '');
            $stmtFondateur->bindValue(':email', $fondateur['email'] ?? '');
            $stmtFondateur->execute();
        }

        // Insérer les décrets dans la table `decret_etablissement`
        $stmtDecret = $pdo->prepare('INSERT INTO decret_etablissement (etablissement_id, decret) 
                                     VALUES (:etablissement_id, :decret)');
        foreach ($data['decrets'] as $decret) {
            $stmtDecret->bindValue(':etablissement_id', $etablissementId);
            $stmtDecret->bindValue(':decret', $decret ?? '');
            $stmtDecret->execute();
        }

        // Committer la transaction
        $pdo->commit();

        // Envoyer un email avec le mot de passe généré
        envoyerEmail($data['email_responsable'] ?? '', $motDePasse);

        return json_encode(['msg' => 'Établissement ajouté avec succès']);
    } catch (Exception $e) {
        // Annuler la transaction en cas d'erreur
        $pdo->rollBack();
        return json_encode(['error' => 'Erreur lors de l\'ajout de l\'établissement: ' . $e->getMessage()]);
    }
}

function ModifierEtablissement($data) {
    global $pdo;

    // Mettez à jour les informations de l'établissement
    $stmt = $pdo->prepare('UPDATE utilisateurs SET 
        nom_etablissement = :nom_etablissement, 
        annee_creation = :annee_creation, 
        annee_ouverture = :annee_ouverture,
        nom_responsable = :nom_responsable,
        fonction_responsable = :fonction_responsable,
        telephone_responsable = :telephone_responsable,
        email_responsable = :email_responsable,
        statut = :statut,
        province = :province,
        ville = :ville,
        quartier = :quartier,
        email = :email_etablissement,
        site_web_etablissement = :site_web_etablissement,
        frais_dts_bts = :frais_dts_bts,
        frais_licence = :frais_licence,
        frais_master = :frais_master,
        frais_doctorat = :frais_doctorat,
        autre_frais = :autre_frais
        WHERE id = :utilisateur_id');

    // Liez les valeurs des champs du formulaire
    $stmt->bindValue(':nom_etablissement', $data['nom_etablissement']);
    $stmt->bindValue(':annee_creation', $data['annee_creation']);
    $stmt->bindValue(':annee_ouverture', $data['annee_ouverture']);
    $stmt->bindValue(':nom_responsable', $data['responsable']);
    $stmt->bindValue(':fonction_responsable', $data['fonction_responsable']);
    $stmt->bindValue(':telephone_responsable', $data['telephone_responsable']);
    $stmt->bindValue(':email_responsable', $data['email_responsable']);
    $stmt->bindValue(':statut', $data['statut']);
    $stmt->bindValue(':province', $data['province']);
    $stmt->bindValue(':ville', $data['ville']);
    $stmt->bindValue(':quartier', $data['quartier']);
    $stmt->bindValue(':email_etablissement', $data['email_etablissement']);
    $stmt->bindValue(':site_web_etablissement', $data['site_web_etablissement']);
    $stmt->bindValue(':frais_dts_bts', $data['frais_dts_bts'] ?? 0);
    $stmt->bindValue(':frais_licence', $data['frais_licence'] ?? 0);
    $stmt->bindValue(':frais_master', $data['frais_master'] ?? 0);
    $stmt->bindValue(':frais_doctorat', $data['frais_doctorat'] ?? 0);
    $stmt->bindValue(':autre_frais', $data['autre_frais'] ?? 0);
    $stmt->bindValue(':utilisateur_id', $data['utilisateur_id']);
    $stmt->execute();

    // Gestion des décrets : Suppression des décrets existants
    $stmt = $pdo->prepare('DELETE FROM decret_etablissement WHERE etablissement_id = :utilisateur_id');
    $stmt->bindValue(':utilisateur_id', $data['utilisateur_id']);
    $stmt->execute();

    // Insérer les nouveaux décrets
    $decrets = $data['decrets'];
    foreach ($decrets as $decret) {
        $stmt = $pdo->prepare('INSERT INTO decret_etablissement (etablissement_id, decret) VALUES (:utilisateur_id, :decret)');
        $stmt->bindValue(':utilisateur_id', $data['utilisateur_id']);
        $stmt->bindValue(':decret', $decret['decret']);
        $stmt->execute();
    }

    // Mettez à jour les fondateurs
    $fondateurs = $data['fondateurs'];
    $stmt = $pdo->prepare('DELETE FROM fondateurs WHERE etablissement_id = :utilisateur_id');
    $stmt->bindValue(':utilisateur_id', $data['utilisateur_id']);
    $stmt->execute();

    foreach ($fondateurs as $fondateur) {
        $stmt = $pdo->prepare('INSERT INTO fondateurs (etablissement_id, nom_fondateur, telephone, email) VALUES (:utilisateur_id, :nom_fondateur, :telephone_fondateur, :email_fondateur)');
        $stmt->bindValue(':utilisateur_id', $data['utilisateur_id']);
        $stmt->bindValue(':nom_fondateur', $fondateur['nom_fondateur']);
        $stmt->bindValue(':telephone_fondateur', $fondateur['telephone_fondateur']);
        $stmt->bindValue(':email_fondateur', $fondateur['email_fondateur']);
        $stmt->execute();
    }

    return json_encode(['msg' => 'Utilisateur modifié avec succès']);
}

function SupprimerEtablissement($utilisateur_id) {
    global $pdo;

    $stmt = $pdo->prepare('DELETE FROM utilisateurs WHERE id = :utilisateur_id');
    $stmt->bindValue(':utilisateur_id', $utilisateur_id);
    $stmt->execute();

    return json_encode(['msg' => 'Utilisateur supprimé avec succès']);
}

function getEtablissementCountChange() {
    global $pdo;

    // Calculer le nombre d'établissements publics actuels
    $queryCurrentPublic = "SELECT COUNT(*) AS total_public FROM utilisateurs WHERE role = 1";
    $stmtCurrentPublic = $pdo->prepare($queryCurrentPublic);
    $stmtCurrentPublic->execute();
    $currentPublic = $stmtCurrentPublic->fetch(PDO::FETCH_ASSOC)['total_public'];

    // Calculer le nombre d'établissements privés actuels
    $queryCurrentPrive = "SELECT COUNT(*) AS total_prive FROM utilisateurs WHERE role = 2";
    $stmtCurrentPrive = $pdo->prepare($queryCurrentPrive);
    $stmtCurrentPrive->execute();
    $currentPrive = $stmtCurrentPrive->fetch(PDO::FETCH_ASSOC)['total_prive'];

    // Calculer le nombre d'établissements publics du mois précédent
    $queryPreviousPublic = "
        SELECT COUNT(*) AS total_public 
        FROM utilisateurs 
        WHERE role = 1 AND DATE_FORMAT(date_creation, '%Y-%m') = DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m')
    ";
    $stmtPreviousPublic = $pdo->prepare($queryPreviousPublic);
    $stmtPreviousPublic->execute();
    $previousPublic = $stmtPreviousPublic->fetch(PDO::FETCH_ASSOC)['total_public'];

    // Calculer le nombre d'établissements privés du mois précédent
    $queryPreviousPrive = "
        SELECT COUNT(*) AS total_prive 
        FROM utilisateurs 
        WHERE role = 2 AND DATE_FORMAT(date_creation, '%Y-%m') = DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m')
    ";
    $stmtPreviousPrive = $pdo->prepare($queryPreviousPrive);
    $stmtPreviousPrive->execute();
    $previousPrive = $stmtPreviousPrive->fetch(PDO::FETCH_ASSOC)['total_prive'];

    // Calculer les pourcentages de changement
    $percentageChangePublic = $previousPublic > 0 ? 
        (($currentPublic - $previousPublic) / $previousPublic) * 100 : 0;

    $percentageChangePrive = $previousPrive > 0 ? 
        (($currentPrive - $previousPrive) / $previousPrive) * 100 : 0;

    // Calculer le total général
    $currentTotal = $currentPublic + $currentPrive;
    $previousTotal = $previousPublic + $previousPrive;
    $percentageChangeTotal = $previousTotal > 0 ? 
        (($currentTotal - $previousTotal) / $previousTotal) * 100 : 0;

    return [
        'public' => [
            'current' => $currentPublic,
            'percentageChange' => round($percentageChangePublic, 2)
        ],
        'prive' => [
            'current' => $currentPrive,
            'percentageChange' => round($percentageChangePrive, 2)
        ],
        'total' => [
            'current' => $currentTotal,
            'percentageChange' => round($percentageChangeTotal, 2)
        ]
    ];
}

function getAllEtablissementsDetails() {
    global $pdo;
    
    try {
        // Récupérer tous les établissements
        $queryEtablissements = "SELECT id, nom_etablissement FROM utilisateurs";
        $stmt = $pdo->prepare($queryEtablissements);
        $stmt->execute();
        $etablissements = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($etablissements)) {
            return [
                "success" => false,
                "message" => "Aucun établissement trouvé"
            ];
        }

        $resultats = [];

        foreach ($etablissements as $etablissement) {
            $utilisateurId = $etablissement['id'];
            $nomEtablissement = $etablissement['nom_etablissement'];

            // Récupérer le nombre de filières
            $queryFilieres = "SELECT COUNT(*) as nombre_filieres FROM filieres WHERE utilisateur_id = :utilisateurId";
            $stmt = $pdo->prepare($queryFilieres);
            $stmt->bindParam(':utilisateurId', $utilisateurId, PDO::PARAM_INT);
            $stmt->execute();
            $nombreFilieres = $stmt->fetch(PDO::FETCH_ASSOC)['nombre_filieres'];

            // Récupérer le nombre d'étudiants
            $queryEtudiants = "SELECT COUNT(*) as nombre_etudiants FROM cadres_academiques WHERE utilisateur_id = :utilisateurId";
            $stmt = $pdo->prepare($queryEtudiants);
            $stmt->bindParam(':utilisateurId', $utilisateurId, PDO::PARAM_INT);
            $stmt->execute();
            $nombreEtudiants = $stmt->fetch(PDO::FETCH_ASSOC)['nombre_etudiants'];

            // Récupérer le nombre de professeurs
            $queryProfesseurs = "SELECT COUNT(*) as nombre_professeurs FROM cadres_pedagogiques WHERE utilisateur_id = :utilisateurId";
            $stmt = $pdo->prepare($queryProfesseurs);
            $stmt->bindParam(':utilisateurId', $utilisateurId, PDO::PARAM_INT);
            $stmt->execute();
            $nombreProfesseurs = $stmt->fetch(PDO::FETCH_ASSOC)['nombre_professeurs'];

            // Récupérer le nombre de personnels
            $queryPersonnels = "SELECT COUNT(*) as nombre_personnels FROM personnels WHERE utilisateur_id = :utilisateurId";
            $stmt = $pdo->prepare($queryPersonnels);
            $stmt->bindParam(':utilisateurId', $utilisateurId, PDO::PARAM_INT);
            $stmt->execute();
            $nombrePersonnels = $stmt->fetch(PDO::FETCH_ASSOC)['nombre_personnels'];

            // Ajouter les résultats pour cet établissement
            $resultats[] = [
                "nom_etablissement" => $nomEtablissement,
                "nombre_filieres" => $nombreFilieres,
                "nombre_etudiants" => $nombreEtudiants,
                "nombre_professeurs" => $nombreProfesseurs,
                "nombre_personnels" => $nombrePersonnels
            ];
        }

        // Retourner les résultats pour tous les établissements
        return [
            "success" => true,
            "etablissements" => $resultats
        ];
    } catch (Exception $e) {
        return [
            "success" => false,
            "message" => "Erreur : " . $e->getMessage()
        ];
    }
}



