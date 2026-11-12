// Wraps a validator (body) => errors[] into Express middleware.
export default function validate(validator) {
  return (req, res, next) => {
    const errors = validator(req.body || {});
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    return next();
  };
}
