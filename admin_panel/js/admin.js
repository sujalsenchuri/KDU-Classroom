
  document.addEventListener("DOMContentLoaded", function () {
    const userDropdownToggle = document.getElementById("userDropdown");
    const userDropdownMenu = userDropdownToggle.nextElementSibling;

    // Toggle dropdown when clicking user
    userDropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      userDropdownMenu.classList.toggle("show");
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", function (e) {
      if (
        !userDropdownToggle.contains(e.target) &&
        !userDropdownMenu.contains(e.target)
      ) {
        userDropdownMenu.classList.remove("show");
      }
    });
  });
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("accordionSidebar");
  const toggleTop = document.getElementById("sidebarToggleTop");

  if (sidebar && toggleTop) {
    toggleTop.addEventListener("click", function () {
      sidebar.classList.toggle("active"); // add/remove class
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("accordionSidebar");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("toggled");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("accordionSidebar");
  if (!sidebar) return;

  // 1) Ensure each collapse panel inside sidebar has a unique id and the corresponding toggle points to it.
  let autoIdCounter = 1;
  const navItems = sidebar.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    const toggle = item.querySelector("a.nav-link");
    if (!toggle) return;

    // Usually the collapse panel is either inside the li or the next sibling
    let collapse = item.querySelector(".collapse") || toggle.nextElementSibling;
    if (
      !collapse ||
      !collapse.classList ||
      !collapse.classList.contains("collapse")
    )
      return;

    // Ensure unique id
    let id = collapse.id;
    if (!id || document.querySelectorAll('[id="' + id + '"]').length > 1) {
      id = "collapse-auto-" + autoIdCounter++;
      collapse.id = id;
    }

    const selector = "#" + id;
    // Make toggle compatible with both Bootstrap 4 and 5 and with href anchors
    toggle.setAttribute("data-bs-target", selector);
    toggle.setAttribute("data-target", selector);
    toggle.setAttribute("href", selector);
    toggle.setAttribute("aria-controls", id);
    // safe initial state
    if (!toggle.hasAttribute("aria-expanded"))
      toggle.setAttribute("aria-expanded", "false");
    toggle.classList.add("collapsed");
  });

  // helper: set collapsed class + aria-expanded on toggles according to panels
  function refreshToggles() {
    const collapses = sidebar.querySelectorAll(".collapse");
    collapses.forEach((c) => {
      const id = c.id ? "#" + c.id : null;
      const open = c.classList.contains("show");
      // find all toggles that reference this panel
      const toggles = sidebar.querySelectorAll("a.nav-link");
      toggles.forEach((t) => {
        const tSel =
          t.getAttribute("data-bs-target") ||
          t.getAttribute("data-target") ||
          t.getAttribute("href");
        if (tSel === id) {
          if (open) {
            t.classList.remove("collapsed");
            t.setAttribute("aria-expanded", "true");
          } else {
            t.classList.add("collapsed");
            t.setAttribute("aria-expanded", "false");
          }
        }
      });
    });
  }

  // 2) Handle click on sidebar toggles (delegated)
  sidebar.addEventListener("click", function (e) {
    const toggle = e.target.closest("a.nav-link");
    if (!toggle) return;

    const sel =
      toggle.getAttribute("data-bs-target") ||
      toggle.getAttribute("data-target") ||
      toggle.getAttribute("href");
    if (!sel || !sel.startsWith("#")) return; // not a collapse toggle
    e.preventDefault();

    const target = sidebar.querySelector(sel);
    if (!target) return;

    // If Bootstrap Collapse JS is available, use it for smooth animation.
    if (window.bootstrap && bootstrap.Collapse) {
      const inst =
        bootstrap.Collapse.getInstance(target) ||
        new bootstrap.Collapse(target, { toggle: false });
      const isOpen = target.classList.contains("show");

      if (isOpen) {
        inst.hide();
      } else {
        // close other open panels in sidebar
        sidebar.querySelectorAll(".collapse.show").forEach((c) => {
          if (c !== target) {
            const otherInst =
              bootstrap.Collapse.getInstance(c) ||
              new bootstrap.Collapse(c, { toggle: false });
            otherInst.hide();
          }
        });
        inst.show();
      }

      // refresh aria/classes after transition (with fallback timeout)
      const onEnd = () => {
        refreshToggles();
        target.removeEventListener("transitionend", onEnd);
      };
      target.addEventListener("transitionend", onEnd);
      setTimeout(refreshToggles, 350);
    } else {
      // Fallback: simple show/hide without animation
      const isOpen = target.classList.contains("show");
      sidebar.querySelectorAll(".collapse").forEach((c) => {
        if (c !== target) c.classList.remove("show");
      });
      if (isOpen) target.classList.remove("show");
      else target.classList.add("show");
      refreshToggles();
    }
  });

  // initial sync
  refreshToggles();
});
