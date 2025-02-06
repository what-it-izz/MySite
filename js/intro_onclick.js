document.body.addEventListener('click', function() {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
    // Load new content after fade-out
    setTimeout(function() {
      window.location.href = 'homepage.html';
    }, 500);
});
