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
    window.open('https://wa.me/263779680336', '_blank', 'noopener');
  });

  dateInputs.forEach(function(input){
    input.addEventListener('focus', function(){
      input.type = 'date';
    });
  });
})();
