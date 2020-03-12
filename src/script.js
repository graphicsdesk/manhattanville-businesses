import enterView from 'enter-view';
import textBalancer from 'text-balancer';

import { USE_COVER_HED } from '../config.json';

// Fade in navbar at scroll trigger

const navbar = document.getElementById('navbar');
enterView({
  selector: USE_COVER_HED ? '.headline' : '.step-deck',
  offset: USE_COVER_HED ? 1 : 0.957,
  enter: () => {
    navbar.classList.remove('only-logo');
  },
  exit: () => {    
    navbar.classList.remove('show-nav-links');
    navbar.classList.add('only-logo');
  },
});

// Mobile navbar hamburger trigger

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

// Text balance headline and deck

textBalancer.balanceText('.headline, .deck, .image-overlay .image-caption-text');

// Highlight nav link

const pageNum = parseInt(document.getElementById('body-page-container').getAttribute('data-page-num'));
document.getElementById('nav-link-' + pageNum).classList.add('nav-link-highlighted');
