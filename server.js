const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Configuration de la base de données
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite');
    initializeDatabase();
  }
});

// 2. Initialisation de la DB
function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    )`);

    // Insertion de données de test
    const stmt = db.prepare("INSERT OR IGNORE INTO tasks (id, title, completed) VALUES (?, ?, ?)");
    stmt.run([1, 'Apprendre Express', 0]);
    stmt.run([2, 'Créer une API REST', 0]);
    stmt.finalize();
  });
}

// 3. Middleware pour servir les fichiers statiques React
app.use(express.static(path.join(__dirname, 'build')));




// 4. Routes API (DOIVENT être déclarées avant le catch-all)
// ➤ Récupérer toutes les tâches
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(rows.map(row => ({
      ...row,
      completed: Boolean(row.completed)
    })));
  });
});

// ➤ Récupérer une tâche spécifique
app.get('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!row) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json({ ...row, completed: Boolean(row.completed) });
  });
});

// ➤ Ajouter une nouvelle tâche
app.post('/api/tasks', (req, res) => {
  const { title, completed = false } = req.body;
  if (!title) return res.status(400).json({ error: 'Le titre est requis' });

  db.run(
    'INSERT INTO tasks (title, completed) VALUES (?, ?)',
    [title, completed ? 1 : 0],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur lors de la création' });
      }
      res.status(201).json({ id: this.lastID, title, completed });
    }
  );
});

// 5. Route pour les fichiers statiques (doit être APRÈS les routes API)
app.get('*', (req, res, next) => {
  // Exclusion explicite des routes API
  if (req.path.startsWith('/api/')) return next();
  
  // Renvoie index.html pour toutes les autres routes
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 6. Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🔹 Application React: http://localhost:${PORT}`);
  console.log(`🔹 API Tasks: http://localhost:${PORT}/api/tasks\n`);
});

// Gestion propre de la fermeture
process.on('SIGINT', () => {
  db.close();
  process.exit();
});
