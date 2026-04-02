const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR NODE]: ${err.stack}`);

    // MySQL Duplicate Entry Error
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        let message = 'Cet élément existe déjà dans le système.';
        
        const sqlMsg = err.sqlMessage || '';
        if (sqlMsg.includes('filiere.nom')) message = 'Cette filière existe déjà.';
        if (sqlMsg.includes('options.filiereId')) message = 'Cette option existe déjà pour cette filière.';
        if (sqlMsg.includes('admins.email')) message = 'Cet e-mail administrateur est déjà utilisé.';
        if (sqlMsg.includes('formateurs.email')) message = 'Cet e-mail formateur est déjà utilisé.';
        if (sqlMsg.includes('stagiaires.PRIMARY') || sqlMsg.includes('stagiaires.NumInscription')) message = 'Ce numéro d\'inscription stagiaire existe déjà.';
        if (sqlMsg.includes('classes.PRIMARY')) message = 'Ce groupe (ID) existe déjà.';

        return res.status(400).json({ 
            message,
            code: 'DUPLICATE_ENTRY',
            target: sqlMsg.match(/'(.*?)'/) ? sqlMsg.match(/'(.*?)'/)[1] : 'Unknown'
        });
    }

    // Default Error
    res.status(500).json({ 
        message: 'Une erreur interne est survenue sur le serveur.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorMiddleware;
