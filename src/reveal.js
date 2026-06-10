// Lightweight scroll-reveal directive. Adds `.is-visible` once an element
// enters the viewport. Respects prefers-reduced-motion via CSS (the .reveal
// rule is only defined inside a motion-safe media query).
const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              obs.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
    : null

export const reveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value != null) el.style.transitionDelay = `${binding.value}ms`
    if (io) io.observe(el)
    else el.classList.add('is-visible')
  },
  unmounted(el) {
    if (io) io.unobserve(el)
  },
}
