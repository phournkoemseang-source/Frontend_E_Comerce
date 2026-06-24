export interface ReviewSummarySource {
  reviews?: Array<{ rating?: number | string | null }>
}

export function imageUrl(image?: string) {
  if (!image) return ''
  if (/^https?:\/\//.test(image)) return image
  return `http://localhost:8000/storage/${image}`
}

export function ratingSummary(product: ReviewSummarySource) {
  const ratings = (product.reviews || [])
    .map(review => Number(review.rating))
    .filter(rating => Number.isFinite(rating) && rating > 0)

  if (!ratings.length) return { average: 0, count: 0 }
  return {
    average: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
    count: ratings.length,
  }
}
