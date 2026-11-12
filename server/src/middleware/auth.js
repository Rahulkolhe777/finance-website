// Admin authentication is not implemented yet. Until it is, every protected
// route is rejected so admin endpoints are never exposed unauthenticated.
export default function auth(req, res) {
  res.status(401).json({ message: 'Unauthorized' });
}
