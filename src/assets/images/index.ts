import fashionImage from './fashion.png'

const bannerCandidates = import.meta.glob('./banner-2*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

const bannerMatch = Object.values(bannerCandidates)[0]

export const heroBannerImage = typeof bannerMatch === 'string' ? bannerMatch : fashionImage
export const fashionEditorialImage = fashionImage
