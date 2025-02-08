document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    let lastScrollTop = 0; // Store the last known scroll position
    let footerVisible = false; // Track footer visibility

    document.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight;
        const visibleHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        if (scrollTop + visibleHeight >= totalHeight - 5) {
            // ✅ Show footer when reaching the bottom
            if (!footerVisible) {
                footer.style.opacity = "1";
                footer.style.transform = "translateY(0)";
                footerVisible = true;
            }
        } else if (scrollTop < lastScrollTop) {
            // ✅ Hide footer when scrolling up
            if (footerVisible) {
                footer.style.opacity = "0";
                footer.style.transform = "translateY(100%)";
                footerVisible = false;
            }
        }

        lastScrollTop = scrollTop; // Update scroll position
    });
});
