fetch('data/noticias.json')
  .then(res => {
    // Check if the response was successful before parsing as JSON
    if (!res.ok) {
      throw new Error('Could not find noticias.json: ' + res.status);
    }
    return res.json();
  })
  .then(noticias => {
    const container = document.getElementById('noticias-container');
    if (!container) return;

    // Sort by descending ID to show the most recent news first
    noticias.sort((a, b) => b.id.localeCompare(a.id));

    noticias.forEach(noticia => {
      // Create the article element
      const card = document.createElement('article');
      card.className = `noticia ${noticia.qubox}`;

      // Create the link element
      const link = document.createElement('a');
      link.href = `noticias/${noticia.id}.html`;
      link.setAttribute('aria-label', `Leer más sobre ${noticia.titulo}`);

      // Create the image element
      const img = document.createElement('img');
      img.src = `imgs/${noticia.img}`;
      img.alt = noticia.titulo;

      // Create the headline (h2)
      const h2 = document.createElement('h2');
      h2.textContent = noticia.titulo;

      // Create the 'presente' paragraph
      const presenteDiv = document.createElement('div');
      presenteDiv.className = 'presente';
      const presenteStrong = document.createElement('strong');
      presenteStrong.textContent = 'Presente: ';
      presenteDiv.appendChild(presenteStrong);
      presenteDiv.appendChild(document.createTextNode(noticia.presente));

      // Create the 'futuro' paragraph
      const futuroDiv = document.createElement('div');
      futuroDiv.className = 'futuro';
      const futuroStrong = document.createElement('strong');
      futuroStrong.textContent = 'Futuro: ';
      futuroDiv.appendChild(futuroStrong);
      futuroDiv.appendChild(document.createTextNode(noticia.futuro));

      // Create the break element
      const br = document.createElement('br');

      // Create the button-like span
      const span = document.createElement('span');
      span.className = 'btn-links';
      span.textContent = '📰 Ver noticia';

      // Append all elements to the link
      link.appendChild(img);
      link.appendChild(h2);
      link.appendChild(presenteDiv);
      link.appendChild(futuroDiv);
      link.appendChild(br);
      link.appendChild(span);

      // Append the link to the card
      card.appendChild(link);

      // Append the card to the container
      container.appendChild(card);
    });
  })
  .catch(error => console.error('Error al cargar las noticias:', error));