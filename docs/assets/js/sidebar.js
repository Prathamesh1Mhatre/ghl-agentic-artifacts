// Team Switcher Dropdown Functionality

function toggleTeamSwitcher() {
  const switcher = document.getElementById('teamSwitcher');
  switcher.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const switcher = document.getElementById('teamSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    switcher.classList.remove('open');
  }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const switcher = document.getElementById('teamSwitcher');
    if (switcher) {
      switcher.classList.remove('open');
    }
  }
});

// Prevent dropdown from closing when clicking inside the menu
document.addEventListener('DOMContentLoaded', function() {
  const teamMenu = document.querySelector('.team-menu');
  if (teamMenu) {
    teamMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});
