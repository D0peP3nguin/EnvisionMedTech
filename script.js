function requestItem(itemName) {
  const form = document.getElementById('requestForm');
  form.classList.remove('hidden');
  form.scrollIntoView({ behavior: 'smooth' });
}
