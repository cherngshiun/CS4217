
document.addEventListener('DOMContentLoaded', function(){

  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('mainNav');
  if(btn){
    btn.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'flex';
    });
  }

  const search = document.getElementById('recipeSearch');
  const category = document.getElementById('recipeCategory');
  function filterRecipes(){
    const q = search ? search.value.toLowerCase().trim() : '';
    const cat = category ? category.value : '';
    const cards = document.querySelectorAll('.recipe-card');
    cards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const tags = card.dataset.tags.toLowerCase();
      const matchQuery = !q || title.includes(q) || tags.includes(q);
      const matchCat = !cat || tags.split(',').includes(cat);
      card.style.display = (matchQuery && matchCat) ? '' : 'none';
    });
  }
  if(search) search.addEventListener('input', filterRecipes);
  if(category) category.addEventListener('change', filterRecipes);

  document.querySelectorAll('.servings-input').forEach(input => {
    input.addEventListener('input', function(e){
      const base = parseFloat(this.dataset.base) || 1;
      const newServ = parseFloat(this.value) || base;
      const ratio = newServ / base;
      const listId = this.dataset.target;
      const list = document.getElementById(listId);
      if(!list) return;
      list.querySelectorAll('[data-qty]').forEach(li => {
        const qty = parseFloat(li.getAttribute('data-base-qty')) || 0;
        // compute new quantity and round sensibly
        const newQty = Math.round((qty * ratio) * 100) / 100;
        li.querySelector('.qty').textContent = newQty || '';
      });
    });
  });

  let timerInterval = null;
  function formatTime(s){
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return mm + ':' + ss;
  }
  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('timerStart');
  const pauseBtn = document.getElementById('timerPause');
  const resetBtn = document.getElementById('timerReset');
  const timerInput = document.getElementById('timerMinutes');
  let remaining = 0;
  if(startBtn && timerInput && timerDisplay){
    startBtn.addEventListener('click', function(){
      const mins = parseInt(timerInput.value) || 0;
      remaining = mins * 60;
      if(remaining <= 0) return;
      timerDisplay.textContent = formatTime(remaining);
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        remaining -= 1;
        timerDisplay.textContent = formatTime(Math.max(0,remaining));
        if(remaining <= 0){
          clearInterval(timerInterval);
          // Simple accessible alert
          const msg = document.getElementById('timerAlert');
          if(msg){
            msg.textContent = 'Timer finished.';
            msg.setAttribute('role','alert');
            setTimeout(()=> msg.textContent = '', 4000);
          }
        }
      },1000);
    });
    pauseBtn.addEventListener('click', function(){
      clearInterval(timerInterval);
    });
    resetBtn.addEventListener('click', function(){
      clearInterval(timerInterval);
      remaining = 0;
      timerDisplay.textContent = formatTime(0);
    });
  }


}); 
