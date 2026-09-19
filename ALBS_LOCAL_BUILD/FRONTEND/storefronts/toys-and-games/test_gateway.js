const http = require('http');

const masterPayload = {
  toys: [
    {
      id: "NEXUS-TOY-01",
      name: "Cinematic AI Auto-Follow Drone",
      description: "Sub-250g. Omni Video Showcase Active.",
      originalPrice: 450.00,
      promoPrice: 405.00,
      stock: 2,
      cutoff: 7200000,
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
      video: "https://cdn.pixabay.com/video/2020/02/16/32474-392813184_tiny.mp4",
      style: "fba_dynamic"
    },
    {
      id: "NEXUS-TOY-02",
      name: "Magnetic Levitation Desk Array",
      description: "Trending #1. FBA Secured.",
      originalPrice: 150.00,
      promoPrice: 135.00,
      stock: 6,
      cutoff: 3600000,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
      video: "https://cdn.pixabay.com/video/2020/02/16/32474-392813184_tiny.mp4",
      style: "fba_dynamic"
    }
  ],
  apparel: [
    {
      id: "NEXUS-APP-01",
      name: "Elite Collegiate Performance Golf Polo",
      description: "Championship-tier moisture wicking. Athletic profile.",
      originalPrice: 85.00,
      promoPrice: 76.50,
      stock: 12,
      cutoff: 14400000,
      // HOTFIX: Bulletproof Athletic Polo Lifestyle Image
      image: "https://images.unsplash.com/photo-1586363104862-3a5e222ee166?q=80&w=600&auto=format&fit=crop",
      style: "premium_lifestyle"
    },
    {
      id: "NEXUS-APP-02",
      name: "Carbon-Weave Athletic Quarter-Zip",
      description: "Engineered for mobility. Midnight black.",
      originalPrice: 120.00,
      promoPrice: 108.00,
      stock: 4,
      cutoff: 1800000,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
      style: "premium_lifestyle"
    }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/storefront/master' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(masterPayload));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

server.listen(4030, () => console.log(`[AirBridge Gateway] Master Hub Active on Port 4030. Image Patched.`));
