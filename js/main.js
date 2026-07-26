(function(){
  const track = document.getElementById('servicesTrack');
  const previous = document.querySelector('.service-prev');
  const next = document.querySelector('.service-next');
  const quoteForm = document.getElementById('quoteForm');
  const dateInputs = document.querySelectorAll('.date-input');

  function scrollAmount(){
    const firstCard = track && track.querySelector('.service-card');
    if(!firstCard) return 240;
    const gap = parseFloat(getComputedStyle(track).gap) || 14;
    return firstCard.getBoundingClientRect().width + gap;
  }

  previous?.addEventListener('click', function(){
    track.scrollBy({left:-scrollAmount(), behavior:'smooth'});
  });

  next?.addEventListener('click', function(){
    track.scrollBy({left:scrollAmount(), behavior:'smooth'});
  });

  quoteForm?.addEventListener('submit', function(event){
    event.preventDefault();
    const data = new FormData(quoteForm);
    const message = [
      'Hello Virtcruise Travels, I would like a travel quote.',
      'Name: ' + (data.get('name') || 'Not provided'),
      'Email: ' + (data.get('email') || 'Not provided'),
      'Mobile: ' + (data.get('mobile') || 'Not provided'),
      'Destination: ' + (data.get('destination') || 'Not provided'),
      'Departure: ' + (data.get('departure') || 'Not provided'),
      'Return: ' + (data.get('return') || 'Not provided'),
      'Travellers: ' + (data.get('travellers') || 'Not provided'),
      'Budget: ' + (data.get('budget') || 'Not provided')
    ].join('\n');
    window.open('https://wa.me/263772463284?text=' + encodeURIComponent(message), '_blank', 'noopener');
  });

  dateInputs.forEach(function(input){
    input.addEventListener('focus', function(){
      input.type = 'date';
    });
  });
})();
