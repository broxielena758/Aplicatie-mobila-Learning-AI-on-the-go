document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    let lastScrollTop = 0; // Store the last known scroll position

    document.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight;
        const visibleHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        if (scrollTop + visibleHeight >= totalHeight - 5) {
            // ✅ Show footer when reaching the bottom
            footer.style.opacity = "1";
            footer.style.transform = "translateY(0)";
        } else if (scrollTop < lastScrollTop) {
            // ✅ Hide footer when scrolling up
            footer.style.opacity = "0";
            footer.style.transform = "translateY(100%)";
        }

        lastScrollTop = scrollTop; // Update scroll position
    });
});
