# Images

Every image is listed once in `packages/content/images.json`, and pages refer to images **by id only**.
The current photos come from Unsplash and Pexels under their free licences, and each is credited on `/credits`.

## Replacing a stock photo with your own

1. **Prepare the photo:**
   - Landscape works best for heroes; aim for 16:10 or wider.
   - At least 1920 px wide, with the main subject centred, because heroes are cropped with `object-fit: cover`.
   - Export as JPEG or WebP (any size; the build creates optimised versions).
   - Avoid visible faces of people who haven't agreed to be photographed, Thai royal imagery and government emblems.
2. **Add the file** to `apps/web/public/images/`, named after the id (e.g. `muay-thai-training.jpg`), and delete the old file.
3. **Update the entry** in `packages/content/images.json`:
   ```json
   {
     "id": "muay-thai-training",
     "src": "/images/muay-thai-training.jpg",
     "width": 2400,
     "height": 1600,
     "alt": {
       "en": "Fighters training on pads at a camp in Chiang Mai",
       "fr": "Combattants s'entraînant aux paos dans un camp à Chiang Mai",
       "nl": "Vechters trainen op pads in een kamp in Chiang Mai",
       "th": "นักมวยซ้อมเป้าในค่ายมวยที่เชียงใหม่"
     },
     "credit": "Your name",
     "creditUrl": "https://thaivisaexperts.com/about/",
     "sourceUrl": "https://thaivisaexperts.com/about/",
     "licence": "Owner"
   }
   ```
   - `width` and `height` must be the real pixel size, which reserves layout space so the page doesn't jump.
   - Alt text describes what's in the photo, in all four languages. Don't start it with "Image of".
4. **Check** with `pnpm --filter @tve/content test` and `pnpm build`. `scripts/prepare.mjs` regenerates the responsive variants (`public/images/_w/`) and share images (`public/images/_og/`), which are not committed.

## Adding a new image

Add a file and an entry the same way with a new id, then reference the id from content (`heroImage`) or a page.
