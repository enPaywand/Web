/* ==========================================================================
   main.js — the only script on the site
   --------------------------------------------------------------------------
   Five small jobs, no dependencies:
     1. Reveal sections as they scroll into view.
     2. Add a blurred background to the header once the page is scrolled.
     3. Drive the mobile navigation panel.
     4. Highlight the nav link for the section currently in view.
     5. Copy the email address to the clipboard.

   Everything degrades gracefully: with JS disabled the page is fully
   readable and all anchors still work.
   ========================================================================== */

(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");

  /* --- 1. Scroll reveal ------------------------------------------------ */

  var revealTargets = document.querySelectorAll("[data-reveal]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealTargets.length && "IntersectionObserver" in window && !reducedMotion) {
    var pending = [];

    // Only elements that start below the fold are animated. Anything already
    // on screen is left alone, so there is no flash and nothing can get stuck
    // invisible if this script fails.
    Array.prototype.forEach.call(revealTargets, function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add("reveal", "is-hidden");
        pending.push(el);
      }
    });

    // Cascade siblings so lists and grids stagger instead of popping together.
    pending.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.classList.contains("is-hidden");
      });
      var index = siblings.indexOf(el);

      if (index > 0) {
        el.style.transitionDelay = Math.min(index, 5) * 70 + "ms";
      }
    });

    var forget = function (el) {
      pending = pending.filter(function (item) {
        return item !== el;
      });
    };

    var reveal = function (el) {
      el.classList.remove("is-hidden");

      // Drop the stagger delay once the entrance is done, so hover
      // transitions respond immediately.
      el.addEventListener(
        "transitionend",
        function () {
          el.style.transitionDelay = "";
        },
        { once: true }
      );

      revealObserver.unobserve(el);
      forget(el);
    };

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    // Safety net. The observer only reports threshold crossings, so an element
    // that is jumped over — anchor link, restored scroll position, very fast
    // fling — is never reported and would stay at opacity 0 for good. Anything
    // already above the viewport bottom is therefore revealed on scroll.
    var revealSkipped = function () {
      pending.slice().forEach(function (el) {
        if (el.getBoundingClientRect().bottom > 0) {
          return;
        }

        el.style.transitionDelay = "";
        el.classList.remove("is-hidden");
        revealObserver.unobserve(el);
        forget(el);
      });

      if (!pending.length) {
        window.removeEventListener("scroll", revealSkipped);
      }
    };

    window.addEventListener("scroll", revealSkipped, { passive: true });

    pending.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* --- 2. Header state on scroll --------------------------------------- */

  if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* --- 3. Mobile navigation -------------------------------------------- */

  if (header && toggle && nav) {
    var isOpen = function () {
      return toggle.getAttribute("aria-expanded") === "true";
    };

    var setOpen = function (open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector(".sr-only").textContent = open
        ? "Close navigation"
        : "Open navigation";
    };

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    // Tapping any link closes the panel.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    // Escape closes it and returns focus to the button.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Resizing up to desktop must not leave a stale "open" state behind.
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (event) {
      if (event.matches) {
        setOpen(false);
      }
    });
  }

  /* --- 4. Active section in the navigation ----------------------------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));

  if (navLinks.length && "IntersectionObserver" in window) {
    var sections = navLinks
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    var visible = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting;
        });

        // Pick the first visible section in document order, so overlapping
        // sections never produce two active links.
        var activeId = null;
        sections.forEach(function (section) {
          if (!activeId && visible[section.id]) {
            activeId = section.id;
          }
        });

        navLinks.forEach(function (link) {
          var active = activeId !== null && link.getAttribute("href") === "#" + activeId;
          link.classList.toggle("is-active", active);
          if (active) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      // A thin band across the middle of the viewport decides what is "current".
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* --- 5. Copy email address ------------------------------------------- */

  var copyBtn = document.querySelector("[data-copy-email]");

  if (copyBtn) {
    // Clipboard access requires a secure context; hide the button if unavailable.
    if (!navigator.clipboard || !window.isSecureContext) {
      copyBtn.hidden = true;
    } else {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(copyBtn.getAttribute("data-copy-email")).then(function () {
          var label = copyBtn.querySelector(".copy-btn__label");
          var status = document.getElementById("copy-status");

          copyBtn.classList.add("is-copied");
          if (label) {
            label.textContent = "Copied";
          }
          if (status) {
            status.textContent = "Email address copied to clipboard";
          }

          window.setTimeout(function () {
            copyBtn.classList.remove("is-copied");
            if (label) {
              label.textContent = "Copy";
            }
            if (status) {
              status.textContent = "";
            }
          }, 2000);
        }).catch(function () {
          // Silently ignore: the mailto link still works.
        });
      });
    }
  }
})();
