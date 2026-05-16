/**
 * Fallback image URLs and category-based static aesthetic images for event images.
 * Replaced unstable source.unsplash.com with highly reliable static Pinterest-aesthetic photography.
 */

// Curated array of high-quality static Unsplash URLs that match a Pinterest aesthetic
const AESTHETIC_IMAGES = {
  Workshop: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80&auto=format&fit=crop',
  Entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
  Networking: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80&auto=format&fit=crop',
  Social: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80&auto=format&fit=crop',
  Creative: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop',
  Wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
  Shopping: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop',
  'Food & Drink': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format&fit=crop',
  Default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format&fit=crop',
};

/** Default placeholder when no category matches or image fails */
export const DEFAULT_EVENT_IMAGE = AESTHETIC_IMAGES.Default;

/** Hero / wide banner (e.g. 1600x600) */
export const HERO_IMAGE = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&q=80&auto=format&fit=crop';

/** Generic portrait for avatars */
export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop';

/** Auth pages (login/register) decorative panel */
export const AUTH_PANEL_IMAGE = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80&auto=format&fit=crop';

/**
 * Returns a static curated URL for the given category (for fallback or placeholder).
 * @param {string} [category] - Event category
 */
export function getCategoryImageUrl(category) {
  return (category && AESTHETIC_IMAGES[category]) || DEFAULT_EVENT_IMAGE;
}

/**
 * Returns the best available image URL for an event (primary or category fallback).
 * @param {{ image?: string, category?: string }} event
 */
export function getEventImageUrl(event) {
  if (event?.image) return event.image;
  return getCategoryImageUrl(event?.category);
}
