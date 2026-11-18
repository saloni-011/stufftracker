const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ─── In-memory data store ──────────────────────────────────────────────────────

let categories = [
  { id: uuidv4(), name: 'Electronics' },
  { id: uuidv4(), name: 'Clothes' },
  { id: uuidv4(), name: 'Books' },
];

let locations = [
  { id: uuidv4(), name: 'Living Room', description: 'Main living area' },
  { id: uuidv4(), name: 'Bedroom', description: 'Master bedroom' },
  { id: uuidv4(), name: 'Storage', description: 'Storage room / garage' },
];

let items = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'MacBook Pro 14"',
    quantity: 1,
    categoryId: categories[0].id,
    locationId: locations[0].id,
  },
  {
    id: uuidv4(),
    name: 'Wireless Headphones',
    description: 'Sony WH-1000XM5',
    quantity: 1,
    categoryId: categories[0].id,
    locationId: locations[1].id,
  },
  {
    id: uuidv4(),
    name: 'Winter Jacket',
    description: 'North Face puffer jacket',
    quantity: 2,
    categoryId: categories[1].id,
    locationId: locations[1].id,
  },
  {
    id: uuidv4(),
    name: 'JavaScript: The Good Parts',
    description: 'Programming book by Douglas Crockford',
    quantity: 1,
    categoryId: categories[2].id,
    locationId: locations[0].id,
  },
  {
    id: uuidv4(),
    name: 'Moving Boxes',
    description: 'Empty cardboard boxes',
    quantity: 10,
    categoryId: null,
    locationId: locations[2].id,
  },
];

// ─── Health ────────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Categories ────────────────────────────────────────────────────────────────

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const category = { id: uuidv4(), name: name.trim() };
  categories.push(category);
  res.status(201).json(category);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  categories.splice(idx, 1);
  // Nullify categoryId on affected items
  items = items.map((item) =>
    item.categoryId === id ? { ...item, categoryId: null } : item
  );
  res.status(204).send();
});

// ─── Locations ─────────────────────────────────────────────────────────────────

app.get('/api/locations', (req, res) => {
  res.json(locations);
});

app.post('/api/locations', (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const location = { id: uuidv4(), name: name.trim(), description: description || '' };
  locations.push(location);
  res.status(201).json(location);
});

app.delete('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const idx = locations.findIndex((l) => l.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Location not found' });
  }
  locations.splice(idx, 1);
  res.status(204).send();
});

// ─── Items ─────────────────────────────────────────────────────────────────────

app.get('/api/items', (req, res) => {
  const { categoryId, locationId, search } = req.query;
  let result = [...items];

  if (categoryId) {
    result = result.filter((i) => i.categoryId === categoryId);
  }
  if (locationId) {
    result = result.filter((i) => i.locationId === locationId);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q))
    );
  }

  res.json(result);
});

app.post('/api/items', (req, res) => {
  const { name, description, quantity, categoryId, locationId } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const qty = quantity !== undefined ? Number(quantity) : 1;
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: 'quantity must be an integer >= 1' });
  }

  const item = {
    id: uuidv4(),
    name: name.trim(),
    description: description || '',
    quantity: qty,
    categoryId: categoryId || null,
    locationId: locationId || null,
  };
  items.push(item);
  res.status(201).json(item);
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

app.put('/api/items/:id', (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const { name, description, quantity, categoryId, locationId } = req.body;

  if (name !== undefined && (!name || !name.trim())) {
    return res.status(400).json({ error: 'name cannot be empty' });
  }
  if (quantity !== undefined) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'quantity must be an integer >= 1' });
    }
  }

  const existing = items[idx];
  items[idx] = {
    ...existing,
    name: name !== undefined ? name.trim() : existing.name,
    description: description !== undefined ? description : existing.description,
    quantity: quantity !== undefined ? Number(quantity) : existing.quantity,
    categoryId: categoryId !== undefined ? (categoryId || null) : existing.categoryId,
    locationId: locationId !== undefined ? (locationId || null) : existing.locationId,
  };

  res.json(items[idx]);
});

app.delete('/api/items/:id', (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(idx, 1);
  res.status(204).send();
});

// ─── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`StuffTracker API running on port ${PORT}`);
});
