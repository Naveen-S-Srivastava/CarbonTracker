document.addEventListener('DOMContentLoaded', function() {
  // Newsletter subscription
  document.getElementById('subscribe-btn').addEventListener('click', function() {
    const email = document.getElementById('newsletter-email').value;
    if (email && email.includes('@')) {
      alert('Thanks for subscribing to our newsletter!');
      document.getElementById('newsletter-email').value = '';
    } else {
      alert('Please enter a valid email address');
    }
  });
});
