// Wraps a validator into Express middleware.
// A validator returns either errors[] or { errors, data }. When `data` is
// returned it replaces req.body, so only whitelisted, normalised fields reach
// the controller.
export default function validate(validator) {
  return (req, res, next) => {
    const result = validator(req.body || {});
    const errors = Array.isArray(result) ? result : result.errors || [];
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (!Array.isArray(result) && result.data) req.body = result.data;
    return next();
  };
}
