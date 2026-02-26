/**
 * <tcg-product-gallery> — image gallery with thumbnails and zoom.
 *
 * Usage in Liquid:
 *   <tcg-product-gallery>
 *     <div data-gallery-main>
 *       <img data-gallery-image src="..." alt="...">
 *     </div>
 *     <div data-gallery-thumbs>
 *       <button data-thumb-index="0"><img src="..." alt="..."></button>
 *       <button data-thumb-index="1"><img src="..." alt="..."></button>
 *     </div>
 *   </tcg-product-gallery>
 *
 * Features:
 * - Click thumbnail to swap main image
 * - Hover zoom on main image (desktop)
 * - Touch swipe on mobile
 *
 * @element tcg-product-gallery
 */
class TcgProductGallery extends HTMLElement {
  connectedCallback() {
    this._mainContainer = this.querySelector('[data-gallery-main]');
    this._mainImage = this.querySelector('[data-gallery-image]');
    this._thumbs = this.querySelectorAll('[data-thumb-index]');
    this._activeIndex = 0;

    // Collect all image URLs from data attributes
    this._images = [];
    this._thumbs.forEach((thumb) => {
      const img = thumb.querySelector('img');
      this._images.push({
        src: thumb.dataset.fullSrc || img?.src || '',
        alt: img?.alt || '',
      });
    });

    if (this._images.length === 0 && this._mainImage) {
      this._images.push({
        src: this._mainImage.src,
        alt: this._mainImage.alt,
      });
    }

    // Thumb click handlers
    this._thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        this._setActive(parseInt(thumb.dataset.thumbIndex, 10));
      });
    });

    // Zoom on hover (desktop only)
    if (this._mainContainer && window.matchMedia('(hover: hover)').matches) {
      this._mainContainer.addEventListener('mousemove', this._onMouseMove.bind(this));
      this._mainContainer.addEventListener('mouseleave', this._onMouseLeave.bind(this));
      this._mainContainer.style.overflow = 'hidden';
    }

    // Touch swipe (mobile)
    this._touchStartX = 0;
    this._mainContainer?.addEventListener('touchstart', (e) => {
      this._touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this._mainContainer?.addEventListener('touchend', (e) => {
      const diff = this._touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && this._activeIndex < this._images.length - 1) {
          this._setActive(this._activeIndex + 1);
        } else if (diff < 0 && this._activeIndex > 0) {
          this._setActive(this._activeIndex - 1);
        }
      }
    }, { passive: true });

    // Listen for variant changes to update gallery
    this.closest('section')?.addEventListener('variant:change', (e) => {
      const variant = e.detail?.variant;
      if (variant?.featured_image) {
        // Find matching thumbnail
        const matchIndex = this._images.findIndex((img) =>
          img.src.includes(variant.featured_image.id) || img.alt === variant.featured_image.alt
        );
        if (matchIndex >= 0) this._setActive(matchIndex);
      }
    });

    this._updateThumbs();
  }

  /** @private */
  _setActive(index) {
    if (index < 0 || index >= this._images.length) return;
    this._activeIndex = index;

    if (this._mainImage) {
      this._mainImage.src = this._images[index].src;
      this._mainImage.alt = this._images[index].alt;
    }

    this._updateThumbs();
  }

  /** @private */
  _updateThumbs() {
    this._thumbs.forEach((thumb, i) => {
      const isActive = i === this._activeIndex;
      thumb.classList.toggle('ring-2', isActive);
      thumb.classList.toggle('ring-primary', isActive);
      thumb.classList.toggle('opacity-50', !isActive);
      thumb.setAttribute('aria-pressed', isActive);
    });
  }

  /** @private — zoom on hover */
  _onMouseMove(e) {
    if (!this._mainImage) return;
    const rect = this._mainContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    this._mainImage.style.transformOrigin = `${x}% ${y}%`;
    this._mainImage.style.transform = 'scale(2)';
    this._mainImage.style.cursor = 'zoom-in';
  }

  /** @private */
  _onMouseLeave() {
    if (!this._mainImage) return;
    this._mainImage.style.transform = '';
    this._mainImage.style.cursor = '';
  }
}

customElements.define('tcg-product-gallery', TcgProductGallery);
