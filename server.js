import express from 'express';
import { body, validationResult } from 'express-validator';
const app = express();
const port = 6336;

let livros = [
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', categoria: 'Romance', id: 1 },
    { titulo: '1984', autor: 'George Orwell', categoria: 'Ficcão', id: 2 },
    { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', categoria: 'Fantasia', id: 3 },
    { titulo: 'Neuromancer', autor: 'William Gibson', categoria: 'Ficcão', id: 4 },
    { titulo: 'O Cortiço', autor: 'Aluísio Azevedo', categoria: 'Romance', id: 5 },
    { titulo: 'A Arte da Guerra', autor: 'Sun Tzu', categoria: 'Não-Ficção', id: 6 },
    { titulo: 'O Príncipe', autor: 'Nicolau Maquiavel', categoria: 'Não-ficcão', id: 7 },
    { titulo: 'Percy Jackson - O Ladrão de Raios', autor: 'Rick Riordan', categoria: 'Fantasia', id: 8 }
];

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof validationResult(req).constructor) {
    return res.status(400).json({ errors: err.array() });
  }

  res.status(500).json({ mensagem: 'Ocorreu um erro interno' });
});

app.get('/livros', (req, res) => {
    res.json(livros);
});

app.get('/livros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const livro = livros.find(l => l.id === id);

    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
});

app.get('/livros/categoria/:categoria', (req, res) => {
  const categoria = req.params.categoria.toLowerCase();
  const livrosPorCategoria = livros.filter(l => l.categoria.toLowerCase() === categoria);

  if (livrosPorCategoria.length > 0) {
      res.json(livrosPorCategoria);
  } else {
      res.status(404).json({ mensagem: 'Categoria não encontrada' });
  }
});

app.get('/livros/autores/:autor', (req, res) => {
  const autores = req.params.autor.toLowerCase();
  const livrosPorAutor = livros.filter(l => l.autor.toLowerCase() === autores);

  if (livrosPorAutor.length > 0) {
    res.json(livrosPorAutor);
} else {
    res.status(404).json({ mensagem: 'Autor não encontrado' });
}
});

app.post('/livros',
    express.json(),
  [
    body('titulo').notEmpty().withMessage('O título é obrigatório'),
    body('autor').notEmpty().withMessage('O autor é obrigatório'),
    body('categoria').notEmpty().withMessage('A categoria é obrigatória'),
  ],
  
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const novoLivro = req.body;
    novoLivro.id = livros.length + 1;
    livros.push(novoLivro);
    res.status(201).json({ sucesso: { mensagem: 'Livro adicionado com sucesso', livro: novoLivro } });
    }, 
  
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors);
    }

    
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
 });
