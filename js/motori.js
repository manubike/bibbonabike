<script>
    document.addEventListener('DOMContentLoaded', () => {
        const track = document.querySelector('.logo-carousel-track');
        
        // Mette in pausa l'animazione al passaggio del mouse
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        // Riprende l'animazione quando il mouse esce
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });
</script>
