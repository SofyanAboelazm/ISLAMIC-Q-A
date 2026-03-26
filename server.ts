import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load firebase config for server-side lookup
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf-8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // Intercept /results to inject meta tags
  app.get('/results', async (req, res, next) => {
    const id = req.query.id as string;
    if (!id) return next();

    try {
      const docRef = doc(db, 'searchHistory', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const title = data.query || 'Islamic Q&A';
        const description = data.answer ? (data.answer.substring(0, 160) + '...') : 'Religious Questions and Answers';
        const imageUrl = data.ogImageUrl || '';
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        let template: string;
        if (process.env.NODE_ENV !== 'production') {
          template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
        } else {
          template = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8');
        }

        const metaTags = `
          <title>${title} - Islamic Q&A</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${url}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${imageUrl}" />
        `;

        const html = template.replace('<!-- META_TAGS_PLACEHOLDER -->', metaTags);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        return;
      }
    } catch (err) {
      console.error('Error injecting meta tags:', err);
    }
    next();
  });

  // Fallback for SPA
  app.get('*', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
      let template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } else {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
